from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import base64
import os
from groq import Groq
from dotenv import load_dotenv
from database import get_connection

load_dotenv()

router = APIRouter(prefix="/vision", tags=["Vision AI"])


# ----------------------------
# Ensure recipes table exists
# ----------------------------
def create_table():
    try:
        with get_connection() as conn:
            cur = conn.cursor()

            cur.execute("""
                CREATE TABLE IF NOT EXISTS recipes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_email TEXT,
                    ingredients TEXT,
                    generated_recipe TEXT
                )
            """)

            conn.commit()

    except Exception as e:
        print("DB Table Creation Error:", e)


# ----------------------------
# Generate Recipe From Image
# ----------------------------
@router.post("/generate-from-images")
async def generate_from_images(
    file: UploadFile = File(...),
    user_email: str = Form(None)   # ✅ optional now
):

    try:

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY missing")

        client = Groq(api_key=api_key)

        # Validate file
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file must be an image")

        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image uploaded")

        base64_image = base64.b64encode(image_bytes).decode("utf-8")

        # ----------------------------
        # Step 1: Detect Ingredients
        # ----------------------------
        vision_response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": "List all visible food ingredients in this image separated by commas."},
                    {"type": "image_url", "image_url": {"url": f"data:{file.content_type};base64,{base64_image}"}}
                ]
            }],
            max_tokens=300
        )

        ingredients = vision_response.choices[0].message.content.strip()

        # ----------------------------
        # Step 2: Generate Recipe
        # ----------------------------
        recipe_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{
                "role": "user",
                "content": f"""
Create a cooking recipe using these ingredients:

{ingredients}

Format:
Recipe Name:
Ingredients:
Cooking Time:
Steps:
Chef Tips:
"""
            }],
            max_tokens=700
        )

        recipe = recipe_response.choices[0].message.content.strip()

        # ----------------------------
        # Step 3: Save to Database
        # ----------------------------
        create_table()

        with get_connection() as conn:
            cur = conn.cursor()

            cur.execute("""
                INSERT INTO recipes (user_email, ingredients, generated_recipe)
                VALUES (?, ?, ?)
            """, (user_email or "guest", ingredients, recipe))

            conn.commit()

        return {
            "filename": file.filename,
            "detected_ingredients": ingredients,
            "generated_recipe": recipe
        }

    except Exception as e:
        print("Unexpected Error:", e)
        raise HTTPException(status_code=500, detail=str(e))