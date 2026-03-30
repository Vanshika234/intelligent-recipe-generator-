import qrcode
import os
import uuid

# 📁 Folder create
QR_DIR = "uploads/qr"
os.makedirs(QR_DIR, exist_ok=True)


def generate_qr(data):
    try:
        # 🔥 Unique filename (important)
        filename = f"qr_{uuid.uuid4().hex}.png"

        file_path = os.path.join(QR_DIR, filename)

        # ✅ Generate QR
        qr = qrcode.make(data)
        qr.save(file_path)

        # ✅ Return path (for API response)
        return file_path

    except Exception as e:
        print("QR ERROR:", e)
        return None