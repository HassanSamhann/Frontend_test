import os
from PIL import Image

def crop_cards():
    figma_path = 'C:/Users/Hassan/.gemini/antigravity-ide/brain/c27ae2f1-e5e2-4ebc-862c-aa1a49b1b325/figma_desktop_frame_1735_1781695591971.png'
    img = Image.open(figma_path)
    
    # We will crop regions around the matched coordinates:
    # 1. image 13 (1).png at (672, 300) -> Size: 101x137
    # 2. 96d92fa4f08e0bdd9fa6fd7b1e59231ec3d3d38b.png at (936, 180) -> Size: 713x713 (Wait, this is large, let's crop a normal card area)
    # 3. Frame 4480.png at (900, 492) -> Size: 100x151
    # 4. Wyze_Cam_V4_01.0001.png (1).png at (1536, 624) -> Size: 101x137
    
    crops = {
        'card_at_672_300': (600, 200, 850, 480), # x_min, y_min, x_max, y_max
        'card_at_900_492': (800, 420, 1050, 700),
        'card_at_936_180': (850, 100, 1100, 380),
        'card_at_1536_624': (1400, 520, 1680, 800)
    }
    
    os.makedirs('public/images/debug', exist_ok=True)
    for name, bbox in crops.items():
        cropped = img.crop(bbox)
        cropped.save(f'public/images/debug/{name}.png')
        print(f"Saved public/images/debug/{name}.png with size {cropped.size}")

if __name__ == '__main__':
    crop_cards()
