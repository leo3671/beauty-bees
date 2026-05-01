from PIL import Image
import sys

input_path = '/Users/prajwal/.gemini/antigravity/brain/6ac7c33a-9ca5-46d6-a37a-12503252bdf3/canva_design_logo_1777598480407.png'
output_path = '/Users/prajwal/.gemini/antigravity/scratch/beauty-bees/public/logo.png'

try:
    img = Image.open(input_path)
    width, height = img.size
    
    # Crop coordinates (left, upper, right, lower)
    # The image has black borders on left and right, and the IG part is at the bottom.
    # Let's crop out the black borders and the bottom IG part.
    left = width * 0.15
    upper = height * 0.05
    right = width * 0.85
    lower = height * 0.75  # Crop above the "Buzzing with beauty" or just above IG
    
    cropped_img = img.crop((left, upper, right, lower))
    cropped_img.save(output_path)
    print("Logo successfully cropped and saved.")
except Exception as e:
    print(f"Error: {e}")
