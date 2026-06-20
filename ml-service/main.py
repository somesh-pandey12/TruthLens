import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://truth-lens-eight-ochre.vercel.app",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str
    url: str = ""

def analyze_with_gemini(text: str, url: str = "") -> dict:
    prompt = f"""
    You are a fake news detection expert. Analyze the following news content for credibility.

    News Content: {text}
    Source URL: {url if url else "Not provided"}

    Respond ONLY with a valid JSON object using exactly these fields:
    {{
        "verdict": "Real" or "Fake" or "Uncertain",
        "credibilityScore": <number 0-100>,
        "confidence": <number 0-100>,
        "sentiment": "Positive" or "Negative" or "Neutral",
        "bias": "Left" or "Right" or "Center" or "Unknown",
        "reasons": ["reason 1", "reason 2", "reason 3"],
        "summary": "<one sentence summary of the content>",
        "redFlags": ["flag1", "flag2"] 
    }}

    No extra text, no markdown, only raw JSON.
    """

    try:
        response = gemini_model.generate_content(prompt)
        raw = response.text.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)
        return result

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Gemini returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")


@app.post("/analyze")
async def analyze(input: TextInput):
    if not input.text or len(input.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text too short to analyze")
    try:
        result = analyze_with_gemini(input.text, input.url)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model": "gemini-1.5-flash",
        "service": "TruthLens ML API"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)