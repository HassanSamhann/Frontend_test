import os
from PIL import Image

def find_match(large_img_path, small_img_path, scale=8):
    # Load images
    large_img = Image.open(large_img_path).convert('L')
    small_img = Image.open(small_img_path).convert('L')
    
    # Downsample for speed
    large_resized = large_img.resize((large_img.width // scale, large_img.height // scale), Image.Resampling.NEAREST)
    small_resized = small_img.resize((max(1, small_img.width // scale), max(1, small_img.height // scale)), Image.Resampling.NEAREST)
    
    lw, lh = large_resized.size
    sw, sh = small_resized.size
    
    if sw > lw or sh > lh:
        return None, float('inf')
        
    large_data = list(large_resized.getdata())
    small_data = list(small_resized.getdata())
    
    min_sad = float('inf')
    best_loc = (0, 0)
    
    # Pre-flatten search space for speed
    for y in range(0, lh - sh + 1, 2):
        for x in range(0, lw - sw + 1, 2):
            sad = 0
            for sy in range(sh):
                row_large_offset = (y + sy) * lw + x
                row_small_offset = sy * sw
                for sx in range(sw):
                    p_large = large_data[row_large_offset + sx]
                    p_small = small_data[row_small_offset + sx]
                    sad += abs(p_large - p_small)
            if sad < min_sad:
                min_sad = sad
                best_loc = (x * scale, y * scale)
                
    # Normalize SAD by area
    norm_sad = min_sad / (sw * sh)
    return best_loc, norm_sad

figma_screenshots = [
    'C:/Users/Hassan/.gemini/antigravity-ide/brain/c27ae2f1-e5e2-4ebc-862c-aa1a49b1b325/figma_desktop_frame_1735_1781695591971.png',
    'C:/Users/Hassan/.gemini/antigravity-ide/brain/c27ae2f1-e5e2-4ebc-862c-aa1a49b1b325/figma_desktop_frame_1736_1781695642409.png',
    'C:/Users/Hassan/.gemini/antigravity-ide/brain/c27ae2f1-e5e2-4ebc-862c-aa1a49b1b325/figma_mobile_1781695707730.png'
]

images_dir = 'public/images'
small_images = [f for f in os.listdir(images_dir) if f.lower().endswith('.png') and 'microSD' not in f and 'Hub' not in f and 'Keypad' not in f and 'Sensor' not in f and 'Badge' not in f and 'logo' not in f]

for f in small_images:
    path = os.path.join(images_dir, f)
    best_screenshot = None
    best_coords = None
    best_sad = float('inf')
    
    for scr in figma_screenshots:
        loc, sad = find_match(scr, path, scale=6)
        if sad < best_sad:
            best_sad = sad
            best_screenshot = os.path.basename(scr)
            best_coords = loc
            
    print(f"File: {f:45s} -> Match: {best_screenshot} at {best_coords} (SAD: {best_sad:.2f})")
