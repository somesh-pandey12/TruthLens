import os
import json
import re
from textblob import TextBlob
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def load_model():
    """Returns Gemini model — replaces heavy RoBERTa model"""
    print("Loading Gemini model...")
    return genai.GenerativeModel("gemini-1.5-flash")


def generate_explanation(label, score, sentiment, blob):
    """Keep your exact same explanation logic"""
    reasons = []
    if blob.sentiment.subjectivity > 0.6:
        reasons.append("High subjectivity detected — opinion-heavy language")
    if blob.sentiment.polarity < -0.3:
        reasons.append("Strong negative emotional tone")
    if score > 90:
        reasons.append(f"Model is {score}% confident in {label} classification")
    return ". ".join(reasons) if reasons else "Standard news language patterns detected."


def analyze_text(classifier, text: str, url: str = ""):
    # 1. Clean text
    clean = re.sub(r'http\S+', '', text).strip()

    # 2. TextBlob sentiment (kept exactly as before)
    blob = TextBlob(clean)
    sentiment = "POSITIVE" if blob.sentiment.polarity > 0 \
                else "NEGATIVE" if blob.sentiment.polarity < 0 \
                else "NEUTRAL"

    # 3. Gemini classification (replaces RoBERTa pipeline)
    prompt = f"""
    You are a fake news detection AI. Analyze this news content.

    Content: {clean[:1000]}
    URL: {url if url else "Not provided"}

    Respond ONLY with a valid JSON object:
    {{
        "label": "REAL" or "FAKE",
        "score": <number 0.0 to 1.0 representing confidence>
    }}

    No extra text. Raw JSON only.
    """

    try:
        response = classifier.generate_content(prompt)
        raw = response.text.strip()

        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        gemini_result = json.loads(raw)
        label = gemini_result.get("label", "UNCERTAIN").upper()
        score = round(float(gemini_result.get("score", 0.5)) * 100, 2)

    except Exception as e:
        print(f"Gemini error: {e}")
        # Safe fallback
        label = "UNCERTAIN"
        score = 50.0

    # 4. Reliability Score (exact same logic as before)
    reliability = score if label == "REAL" else 100 - score

    # 5. Explanation (exact same function as before)
    explanation = generate_explanation(label, score, sentiment, blob)

    # 6. Return exact same structure as before — Node.js won't need changes
    return {
        "verdict": label,
        "reliabilityScore": reliability,
        "confidence": score,
        "sentiment": sentiment,
        "subjectivity": round(blob.sentiment.subjectivity * 100, 2),
        "explanation": explanation
    }