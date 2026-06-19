from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import gc

model = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str
    url: str = ""

def get_model():
    global model
    if model is None:
        from models.classifier import load_model 
        model = load_model()
    return model

@app.post("/analyze")
async def analyze(input: TextInput):
    try:
        clf = get_model()
        from models.classifier import analyze_text
        
        result = analyze_text(clf, input.text, input.url)
        
        gc.collect()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}