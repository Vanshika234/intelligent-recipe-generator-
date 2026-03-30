from fastapi import APIRouter, UploadFile, File, Form
import shutil
import uuid
import os

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

products_db = []


@router.get("/")
def get_products():
    return products_db


@router.post("/")
async def add_product(
    name: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...)
):

    file_ext = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    filepath = f"{UPLOAD_FOLDER}/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    product = {
        "id": len(products_db) + 1,
        "name": name,
        "price": price,
        "image": f"/uploads/{filename}"
    }

    products_db.append(product)

    return {"message": "Product Added", "product": product}


@router.delete("/{product_id}")
def delete_product(product_id: int):

    global products_db
    products_db = [p for p in products_db if p["id"] != product_id]

    return {"message": "Product Deleted"}