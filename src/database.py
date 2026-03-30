import sqlite3
import os

# 📁 Database path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "recipe.db")


# 🔗 DATABASE CONNECTION
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# 🧱 CREATE ALL TABLES
def create_tables():

    with get_connection() as conn:
        cur = conn.cursor()

        # 👤 USERS TABLE
        cur.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
        """)

        # 🍲 RECIPES TABLE
        cur.execute("""
        CREATE TABLE IF NOT EXISTS recipes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT,
            ingredients TEXT,
            generated_recipe TEXT
        )
        """)

        # 📝 BLOGS TABLE
        cur.execute("""
        CREATE TABLE IF NOT EXISTS blogs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            title TEXT,
            content TEXT,
            image TEXT,
            status TEXT DEFAULT 'pending'
        )
        """)

        # 🛒 ORDERS TABLE
        cur.execute("""
        CREATE TABLE IF NOT EXISTS orders(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT,
            items TEXT,
            total_price REAL,
            qr_code TEXT
        )
        """)

        # 🛍 PRODUCTS TABLE (ADMIN SHOP)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS products(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            image TEXT
        )
        """)

        conn.commit()