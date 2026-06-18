from fastapi import FastAPI
from pydantic import BaseModel
from models.classifier import analyze_text

app = FastAPI()

class TextInput(BaseModel):
    text: str
    url: str = ""

@app.post("/analyze")
async def analyze(input: TextInput):
    result = analyze_text(input.text, input.url)
    return result