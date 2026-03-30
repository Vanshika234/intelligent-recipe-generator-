from fastapi import APIRouter, UploadFile, File
from groq import Groq
import base64
import os

router = APIRouter(prefix="/ocr", tags=["Vision Recipe"])

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@router.post("/upload")
async def upload_images(files: list[UploadFile] = File(...)):
    
    content_list = [
        {
            "type": "text",
            "text": "Identify all food ingredients visible in these images. Then generate a complete recipe using those ingredients. Respond strictly in this format:\n\nRecipe Name:\nIngredients Used:\nCooking Time:\nStep-by-Step Instructions:\nTips:"
        }
    ]

    for file in files:
        contents = await file.read()
        encoded_string = base64.b64encode(contents).decode("utf-8")

        content_list.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{encoded_string}"
            }
        })

    response = client.chat.completions.create(
        model="llama-3.2-90b-vision-preview",  # Groq Vision Model
        messages=[
            {
                "role": "user",
                "content": content_list
            }
        ],
        max_tokens=1000
    )

    return {
        "recipe": response.choices[0].message.content
    }