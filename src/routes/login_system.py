from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Dict, List

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ================= SETTINGS =================
SECRET_KEY = "supersecretkey123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ================= TEMP DATABASE =================
fake_users_db: Dict[str, str] = {}
recipe_history_db: List[Dict] = []

# ================= MODELS =================
class RegisterModel(BaseModel):
    email: str
    password: str

class RecipeModel(BaseModel):
    title: str
    ingredients: str
    instructions: str

# ================= PASSWORD =================
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ================= TOKEN =================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ================= REGISTER =================
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: RegisterModel):

    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    fake_users_db[user.email] = hash_password(user.password)

    return {
        "message": "User registered successfully",
        "email": user.email
    }

# ================= LOGIN =================
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    hashed_password = fake_users_db.get(form_data.username)

    if not hashed_password:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(form_data.password, hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    access_token = create_access_token({"sub": form_data.username})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": form_data.username,
        "username": form_data.username.split("@")[0]  # name generate
    }

# ================= VERIFY TOKEN =================
def verify_token(token: str = Depends(oauth2_scheme)):
    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return username

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ================= PROTECTED =================
@router.get("/protected")
def protected_route(current_user: str = Depends(verify_token)):

    return {
        "message": "Protected route",
        "user": current_user
    }