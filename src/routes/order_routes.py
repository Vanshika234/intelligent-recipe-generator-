from fastapi import APIRouter, HTTPException
from database import get_connection
import json
from modules.qr_module import generate_qr
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/orders", tags=["Orders"])


# ✅ MODEL
class OrderModel(BaseModel):
    email: str
    items: List[Dict]
    total: float


# ✅ CREATE TABLE
def create_order_table():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT,
            items TEXT,
            total_price REAL,
            qr_code TEXT
        )
    """)

    conn.commit()
    conn.close()


create_order_table()


# ✅ CREATE ORDER
@router.post("/")
def create_order(order: OrderModel):
    try:

        user_email = order.email
        items = order.items
        total_price = order.total

        if not items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        items_str = json.dumps(items)

        qr_data = f"""
        Order Details
        User: {user_email}
        Total: ₹{total_price}
        Items: {items_str}
        """

        qr_path = generate_qr(qr_data)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO orders (user_email, items, total_price, qr_code) VALUES (?, ?, ?, ?)",
            (user_email, items_str, total_price, qr_path)
        )

        conn.commit()
        conn.close()

        return {
            "message": "Order placed successfully ✅",
            "qr_code": f"http://127.0.0.1:8000/{qr_path}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ GET USER ORDERS
@router.get("/{email}")
def get_orders(email: str):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, items, total_price, qr_code FROM orders WHERE user_email=?",
        (email,)
    )

    rows = cur.fetchall()
    conn.close()

    orders = []

    for row in rows:
        orders.append({
            "id": row[0],
            "items": json.loads(row[1]),
            "total": row[2],
            "qr_code": row[3]
        })

    return {"orders": orders}