import os
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import gc

# Import model loader and analyzer
from models.classifier import load_model, analyze_text

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str
    url: str = ""

model = None

def get_model():
    global model
    if model is None:
        model = load_model()
    return model

@app.post("/analyze")
async def analyze(input: TextInput):
    try:
        clf = get_model()
        result = analyze_text(clf, input.text, input.url)

        gc.collect()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

# RENDER PORT BINDING: 
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)