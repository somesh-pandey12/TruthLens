import os
import json
import re
from textblob import TextBlob
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def load_model():
    print("Loading Gemini model...")
    return genai.GenerativeModel("gemini-2.0-flash")

def analyze_text(classifier, text: str, url: str = ""):
    clean = re.sub(r'http\S+', '', text).strip()
    blob = TextBlob(clean)
    sentiment = "POSITIVE" if blob.sentiment.polarity > 0 \
                else "NEGATIVE" if blob.sentiment.polarity < 0 \
                else "NEUTRAL"

    prompt = f"""
    Analyze this news content for fake news detection.
    Content: {clean[:1000]}
    Respond ONLY with JSON:
    {{"label": "REAL" or "FAKE", "score": <0.0-1.0>}}
    """

    try:
        response = classifier.generate_content(prompt)
        raw = response.text.strip().replace("```json","").replace("```","").strip()
        result = json.loads(raw)
        label = result.get("label", "UNCERTAIN").upper()
        score = round(float(result.get("score", 0.5)) * 100, 2)
    except Exception as e:
        print(f"Gemini error: {e}")
        label = "UNCERTAIN"
        score = 50.0

    reliability = score if label == "REAL" else 100 - score

    return {
        "verdict": label,
        "reliabilityScore": reliability,
        "confidence": score,
        "sentiment": sentiment,
        "subjectivity": round(blob.sentiment.subjectivity * 100, 2),
        "explanation": f"Content classified as {label} with {score}% confidence"
    }