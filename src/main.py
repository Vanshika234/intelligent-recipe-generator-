from database import create_tables, get_connection
from fastapi import FastAPI, APIRouter
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

# ROUTERS
from routes.login_system import router as login_router
from routes.recipe_routes import router as recipe_router
from routes.ocr_routes import router as ocr_router
from routes.blog_routes import router as blog_router
from routes.order_routes import router as order_router
from routes.product_routes import router as product_router

# ENV LOAD
load_dotenv()

# CREATE APP
app = FastAPI(
    title="Intelligent Recipe Generator",
    description="AI-based Recipe Generator with JWT Authentication and Vision AI",
    version="2.0.0"
)

# DATABASE INIT
create_tables()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# UPLOAD FOLDER
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# STATIC FILES
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# HOME ROUTE
@app.get("/")
def home():
    return {"message": "AI Recipe Generator Running Successfully 🚀"}

# FAVICON FIX
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    if os.path.exists("favicon.ico"):
        return FileResponse("favicon.ico")
    return {"message": "No favicon"}

# ==========================
# ADMIN DASHBOARD ROUTES
# ==========================

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

# Admin Stats
@admin_router.get("/stats")
def get_admin_stats():
    with get_connection() as conn:
        cur = conn.cursor()

        try:
            cur.execute("SELECT COUNT(*) FROM users")
            users = cur.fetchone()[0]
        except:
            users = 0

        try:
            cur.execute("SELECT COUNT(*) FROM recipes")
            recipes = cur.fetchone()[0]
        except:
            recipes = 0

        try:
            cur.execute("SELECT COUNT(*) FROM orders")
            orders = cur.fetchone()[0]
        except:
            orders = 0

        try:
            cur.execute("SELECT COUNT(*) FROM products")
            products = cur.fetchone()[0]
        except:
            products = 0

        try:
            cur.execute("SELECT SUM(total_price) FROM orders")
            revenue = cur.fetchone()[0] or 0
        except:
            revenue = 0

        return {
            "total_users": users,
            "total_recipes": recipes,
            "total_orders": orders,
            "total_products": products,
            "revenue": revenue
        }

# Monthly Revenue
@admin_router.get("/monthly-revenue")
def monthly_revenue():
    with get_connection() as conn:
        cur = conn.cursor()

        try:
            cur.execute("""
                SELECT id, total_price
                FROM orders
                ORDER BY id DESC
                LIMIT 6
            """)
            rows = cur.fetchall()
        except:
            rows = []

        data = []
        i = 1

        for r in rows:
            data.append({
                "month": f"Order {i}",
                "revenue": r[1]
            })
            i += 1

        return data

# Top Selling Products
@admin_router.get("/top-products")
def top_products():
    with get_connection() as conn:
        cur = conn.cursor()

        try:
            cur.execute("""
                SELECT product_name, COUNT(*)
                FROM orders
                GROUP BY product_name
                ORDER BY COUNT(*) DESC
                LIMIT 5
            """)
            rows = cur.fetchall()
        except:
            rows = []

        data = []

        for r in rows:
            data.append({
                "product": r[0] if r[0] else "Unknown",
                "orders": r[1]
            })

        return data

# Recent Orders
@admin_router.get("/recent-orders")
def recent_orders():
    with get_connection() as conn:
        cur = conn.cursor()

        try:
            cur.execute("""
                SELECT user_email, product_name, total_price
                FROM orders
                ORDER BY id DESC
                LIMIT 5
            """)
            rows = cur.fetchall()
        except:
            rows = []

        data = []

        for r in rows:
            data.append({
                "user": r[0],
                "product": r[1],
                "price": r[2]
            })

        return data

app.include_router(admin_router)

# ==========================
# EXISTING ROUTERS
# ==========================

app.include_router(login_router)
app.include_router(recipe_router)
app.include_router(ocr_router)
app.include_router(blog_router)
app.include_router(order_router)
app.include_router(product_router)