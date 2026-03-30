import os

UPLOAD_FOLDER = "temp_uploads"

# Create folder if not exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def save_uploaded_file(upload_file):
    file_path = os.path.join(UPLOAD_FOLDER, upload_file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(upload_file.file.read())

    return file_path
