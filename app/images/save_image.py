import os
from time import time

UPLOAD_DIR = "src/images/"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_image(image):
    name = f"image_{time()}.png"
    file_path = os.path.join(UPLOAD_DIR, name)

    with open(file_path, "wb") as file:
        file.write(image)

    return name
