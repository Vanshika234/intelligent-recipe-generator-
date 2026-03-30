from flask import Flask, render_template, request
import os
from ultralytics import YOLO

app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

model = YOLO("yolov8n.pt")

recipes = {
    "Fruit Salad": ["apple", "banana", "orange"],
    "Tomato Omelette": ["egg", "tomato", "onion"],
    "Simple Sandwich": ["bread", "egg"],
    "Chicken Rice": ["chicken", "rice"],
    "Mashed Potato": ["potato", "milk"]
}



def detect_ingredients(image_path):
    results = model(image_path)
    detected = []

    for r in results:
        for box in r.boxes:
            class_id = int(box.cls[0])
            name = model.names[class_id].lower()
            detected.append(name)

    return list(set(detected))



def recommend_recipe(user_ingredients):
    suggestions = []

    for recipe, ingredients in recipes.items():
        match_count = 0

        for item in ingredients:
            if item in user_ingredients:
                match_count += 1

        if match_count > 0:
            suggestions.append(recipe)

    return suggestions



@app.route('/')
def home():
    return render_template("index.html")



@app.route('/analyze', methods=['POST'])
def analyze():

    detected_ingredients = []
    message = ""

    
    if 'image' in request.files and request.files['image'].filename != "":
        file = request.files['image']
        path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(path)

        detected_ingredients = detect_ingredients(path)

    
    manual_input = request.form.get("ingredients")

    if manual_input:
        manual_list = [item.strip().lower() for item in manual_input.split(",")]
        detected_ingredients.extend(manual_list)

    detected_ingredients = list(set(detected_ingredients))

    
    suggested_recipes = recommend_recipe(detected_ingredients)

    
    if not suggested_recipes:
        message = "We couldn't find recipes for the entered items. Please try adding common cooking ingredients like vegetables, fruits, dairy, or grains."

    return render_template(
        "result.html",
        ingredients=detected_ingredients,
        recipes=suggested_recipes,
        message=message
    )


if __name__ == "__main__":
    app.run(debug=True)
