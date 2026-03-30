import sqlite3
from database import get_connection
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------- REGISTER USER ----------
def register_user(name, email, password):
    hashed_password = pwd_context.hash(password)
    try:
        with get_connection() as conn:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                (name, email, hashed_password)
            )
            conn.commit()
        return True
    except sqlite3.IntegrityError:
        # For example, email already exists
        return False
    except Exception as e:
        print("DB error:", e)
        return False


# ---------- LOGIN USER ----------
def login_user(email, password):
    try:
        with get_connection() as conn:
            cur = conn.cursor()
            cur.execute(
                "SELECT password FROM users WHERE email=?",
                (email,)
            )
            row = cur.fetchone()
    except Exception as e:
        print("DB error:", e)
        return False

    if row and pwd_context.verify(password, row[0]):
        return True
    return False


# ---------- SAVE RECIPE ----------
def save_recipe(user_email, ingredients, recipe):
    try:
        with get_connection() as conn:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO recipes (user_email, ingredients, recipe) VALUES (?, ?, ?)",
                (user_email, ingredients, recipe)
            )
            conn.commit()
        return True
    except Exception as e:
        print("DB error:", e)
        return False


# ---------- GET HISTORY ----------
def get_user_history(user_email):
    try:
        with get_connection() as conn:
            cur = conn.cursor()
            cur.execute(
                "SELECT ingredients, recipe FROM recipes WHERE user_email=?",
                (user_email,)
            )
            data = cur.fetchall()
        return data
    except Exception as e:
        print("DB error:", e)
        return []
