from fastapi import APIRouter, UploadFile, File, Form
import sqlite3
import shutil
import os
import uuid

router = APIRouter(prefix="/blogs", tags=["Blogs"])

ADMIN_EMAILS = ["vanshika@gmail.com", "admin@gmail.com"]

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "recipe.db")

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------------- DATABASE CONNECTION ---------------- #

def connect_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


# ---------------- INIT DATABASE ---------------- #

def init_db():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS blogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            title TEXT,
            content TEXT,
            image TEXT
        )
    """)

    # check existing columns
    cur.execute("PRAGMA table_info(blogs)")
    columns = [col["name"] for col in cur.fetchall()]

    if "status" not in columns:
        cur.execute("ALTER TABLE blogs ADD COLUMN status TEXT DEFAULT 'pending'")

    conn.commit()
    conn.close()


init_db()


# ---------------- CREATE BLOG ---------------- #

@router.post("/create")
async def create_blog(
    email: str = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    image: UploadFile = File(...)
):

    filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    conn = connect_db()
    cur = conn.cursor()

    status = "approved" if email in ADMIN_EMAILS else "pending"

    cur.execute(
        "INSERT INTO blogs (email, title, content, image, status) VALUES (?, ?, ?, ?, ?)",
        (email, title, content, filename, status)
    )

    conn.commit()
    conn.close()

    return {
        "message": "Blog submitted successfully",
        "status": status
    }


# ---------------- APPROVED BLOGS ---------------- #

@router.get("/")
def get_blogs():

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM blogs WHERE status='approved' ORDER BY id DESC")
    rows = cur.fetchall()

    conn.close()

    blogs = []

    for r in rows:
        blogs.append({
            "id": r["id"],
            "email": r["email"],
            "title": r["title"],
            "content": r["content"],
            "image": f"/uploads/{r['image']}",
            "status": r["status"]
        })

    return blogs


# ---------------- BLOG DETAIL ---------------- #

@router.get("/detail/{blog_id}")
def get_blog(blog_id: int):

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM blogs WHERE id=?", (blog_id,))
    row = cur.fetchone()

    conn.close()

    if not row:
        return {"error": "Blog not found"}

    return {
        "id": row["id"],
        "email": row["email"],
        "title": row["title"],
        "content": row["content"],
        "image": f"/uploads/{row['image']}",
        "status": row["status"]
    }


# ---------------- ADMIN BLOG LIST ---------------- #

@router.get("/admin/blogs")
def get_all_blogs():

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM blogs ORDER BY id DESC")
    rows = cur.fetchall()

    conn.close()

    blogs = []

    for r in rows:
        blogs.append({
            "id": r["id"],
            "email": r["email"],
            "title": r["title"],
            "content": r["content"],
            "image": f"/uploads/{r['image']}",
            "status": r["status"]
        })

    return blogs


# ---------------- APPROVE BLOG ---------------- #

@router.put("/admin/approve/{blog_id}")
def approve_blog(blog_id: int):

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("UPDATE blogs SET status='approved' WHERE id=?", (blog_id,))

    conn.commit()
    conn.close()

    return {"message": "Blog Approved Successfully"}


# ---------------- REJECT BLOG ---------------- #

@router.put("/admin/reject/{blog_id}")
def reject_blog(blog_id: int):

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("UPDATE blogs SET status='rejected' WHERE id=?", (blog_id,))

    conn.commit()
    conn.close()

    return {"message": "Blog Rejected Successfully"}


# ---------------- DELETE BLOG ---------------- #

@router.delete("/admin/delete/{blog_id}")
def delete_blog(blog_id: int):

    conn = connect_db()
    cur = conn.cursor()

    # get image name first
    cur.execute("SELECT image FROM blogs WHERE id=?", (blog_id,))
    row = cur.fetchone()

    if not row:
        conn.close()
        return {"error": "Blog not found"}

    image_name = row["image"]
    image_path = os.path.join(UPLOAD_DIR, image_name)

    # delete image file
    if os.path.exists(image_path):
        os.remove(image_path)

    # delete blog from database
    cur.execute("DELETE FROM blogs WHERE id=?", (blog_id,))

    conn.commit()
    conn.close()

    return {"message": "Blog Deleted Successfully"}


# ---------------- COMMENT PLACEHOLDER ---------------- #

@router.post("/comment")
def add_comment():
    return {"message": "Comment feature coming soon"}