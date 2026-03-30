from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import sqlite3
import os
from groq import Groq
from routes.login_system import verify_token
from dotenv import load_dotenv

# ✅ FIXED IMPORTS
from validator import is_valid_food_request
from prompt_rules import SYSTEM_PROMPT

# 🔥 ENV LOAD
load_dotenv()

router = APIRouter(prefix="/recipes", tags=["Recipes"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# 🔥 API KEY
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise Exception("❌ GROQ_API_KEY not found")

client = Groq(api_key=api_key)

# 🔥 DATABASE (simple + safe)
DB_PATH = "recipe.db"

def connect_db():
    return sqlite3.connect(DB_PATH)

def ensure_history_table():
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            ingredients TEXT,
            recipe TEXT
        )
    """)
    conn.commit()
    conn.close()

# 🔥 SCHEMA
class RecipeModel(BaseModel):
    ingredients: str


# =========================
# ✅ GENERATE RECIPE
# =========================
@router.post("/generate")
def generate_recipe(data: RecipeModel, token: str = Depends(oauth2_scheme)):
    try:
        print("👉 INPUT:", data.ingredients)

        # 🔐 VERIFY TOKEN
        email = verify_token(token)
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        # 🛑 VALIDATE FOOD REQUEST
        if not is_valid_food_request(data.ingredients):
            raise HTTPException(
                status_code=400,
                detail="Sorry, I can only generate cooking recipes based on food ingredients. Please provide ingredients or a food-related request."
            )

        prompt = f"""
Create a real cooking recipe using:
{data.ingredients}

Format:
Recipe Name:
Ingredients Used:
Cooking Time:
Steps:
Tips:
"""

        # 🤖 GROQ CALL
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000
        )

        recipe_text = response.choices[0].message.content if response.choices else "No recipe generated"

        print("✅ GENERATED")

        # 💾 SAVE HISTORY
        ensure_history_table()

        conn = connect_db()
        cur = conn.cursor()

        print("💾 SAVING:", email, data.ingredients)

        cur.execute(
            "INSERT INTO history (email, ingredients, recipe) VALUES (?, ?, ?)",
            (email, data.ingredients, recipe_text)
        )

        conn.commit()
        conn.close()

        return {"recipe": recipe_text}

    except Exception as e:
        print("❌ ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# ✅ GET HISTORY
# =========================
@router.get("/history")
def get_history(token: str = Depends(oauth2_scheme)):
    try:
        email = verify_token(token)
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        conn = connect_db()
        cur = conn.cursor()

        cur.execute(
            "SELECT ingredients, recipe FROM history WHERE email=? ORDER BY id DESC",
            (email,)
        )

        rows = cur.fetchall()
        conn.close()

        history = []
        for row in rows:
            history.append({
                "ingredients": row[0],
                "recipe": row[1]
            })

        return {"history": history}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))