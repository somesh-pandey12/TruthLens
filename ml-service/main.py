import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5000", "*"])

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")
    url = data.get("url", "")

    if not text or len(text.strip()) < 10:
        return jsonify({"error": "Text too short"}), 400

    clean = re.sub(r'http\S+', '', text).strip()
    blob = TextBlob(clean)
    sentiment = "POSITIVE" if blob.sentiment.polarity > 0 \
                else "NEGATIVE" if blob.sentiment.polarity < 0 \
                else "NEUTRAL"
    subjectivity = round(blob.sentiment.subjectivity * 100, 2)

    prompt = f"""You are a fake news detection expert. Analyze this news content.

Content: {clean[:1000]}
URL: {url or 'Not provided'}
Sentiment: {sentiment}
Subjectivity: {subjectivity}%

Respond ONLY with valid JSON, no markdown:
{{
  "verdict": "REAL" or "FAKE" or "UNCERTAIN",
  "reliabilityScore": <number 0-100>,
  "confidence": <number 0-100>,
  "explanation": "<one sentence>",
  "redFlags": ["flag1", "flag2"]
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # ✅ updated
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=500,
        )
        raw = response.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()
        result = json.loads(raw)

        return jsonify({
            "verdict": result.get("verdict", "UNCERTAIN"),
            "reliabilityScore": result.get("reliabilityScore", 50),
            "confidence": result.get("confidence", 50),
            "sentiment": sentiment,
            "subjectivity": subjectivity,
            "explanation": result.get("explanation", ""),
            "redFlags": result.get("redFlags", [])
        })

    except json.JSONDecodeError:
        return jsonify({"error": "AI returned invalid response"}), 500
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "llama-3.3-70b-versatile"}) # ✅ updated

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)