from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
import sqlite3

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ================= CONFIG =================
SECRET_KEY = "secret123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔥 FIXED TOKEN URL (VERY IMPORTANT)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ================= DATABASE =================
def get_db():
    conn = sqlite3.connect("recipe.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_users_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)
    conn.commit()
    conn.close()

create_users_table()

# ================= MODELS =================
class RegisterModel(BaseModel):
    username: str
    password: str

# ================= PASSWORD =================
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

# ================= TOKEN =================
def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ================= REGISTER =================
@router.post("/register", status_code=201)
def register(user: RegisterModel):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE username=?", (user.username,))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)

    cur.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (user.username, hashed_password)
    )

    conn.commit()
    conn.close()

    return {"message": "Registered successfully"}

# ================= LOGIN =================
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE username=?", (form_data.username,))
    user = cur.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    access_token = create_token({"sub": user["username"]})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }