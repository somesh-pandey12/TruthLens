from transformers import pipeline
from textblob import TextBlob
import re

# Load pre-trained fake news detection model
classifier = pipeline(
    "text-classification",
    model="hamzab/roberta-fake-news-classification"
)

def analyze_text(text: str, url: str = ""):
    # 1. Clean text
    clean = re.sub(r'http\S+', '', text).strip()

    # 2. Classification
    result = classifier(clean[:512])[0]
    label = result['label']   # FAKE or REAL
    score = round(result['score'] * 100, 2)

    # 3. Sentiment Analysis
    blob = TextBlob(clean)
    sentiment = "POSITIVE" if blob.sentiment.polarity > 0 \
                else "NEGATIVE" if blob.sentiment.polarity < 0 \
                else "NEUTRAL"

    # 4. Reliability Score (0-100)
    reliability = score if label == "REAL" else 100 - score

    # 5. Explanation
    explanation = generate_explanation(label, score, sentiment, blob)

    return {
        "verdict": label,
        "reliabilityScore": reliability,
        "confidence": score,
        "sentiment": sentiment,
        "subjectivity": round(blob.sentiment.subjectivity * 100, 2),
        "explanation": explanation
    }

def generate_explanation(label, score, sentiment, blob):
    reasons = []
    if blob.sentiment.subjectivity > 0.6:
        reasons.append("High subjectivity detected — opinion-heavy language")
    if blob.sentiment.polarity < -0.3:
        reasons.append("Strong negative emotional tone")
    if score > 90:
        reasons.append(f"Model is {score}% confident in {label} classification")
    return ". ".join(reasons) if reasons else "Standard news language patterns detected."