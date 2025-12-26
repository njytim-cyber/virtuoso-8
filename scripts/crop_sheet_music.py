"""
Sheet Music Cropping Script with Image Compression
Crops individual scales and compresses for web display.

CORRECT PAGE MAPPING (verified via OCR/visual inspection):
- IMG20251212084748.jpg: Ab Major (I-1), G# Minor Melodic (I-2), G# Minor Harmonic (I-3)
- IMG20251212084755.jpg: Db Major (I-7), C# Minor Melodic (I-8), C# Minor Harmonic (I-9)  
- IMG20251212084759.jpg: C Major (I-4), C Minor Melodic (I-5), C Minor Harmonic (I-6)
- IMG20251212084805.jpg: Eb Major (I-10), Eb Minor Melodic (I-11), Eb Minor Harmonic (I-12)
- IMG20251212084810.jpg: E Major (I-13), E Minor Melodic (I-14), E Minor Harmonic (I-15)
- IMG20251212084816.jpg: Arpeggios Ab Maj (II-1), G# Min (II-2), C Maj (II-3), C Min (II-4), Db Maj (II-5)
- IMG20251212084821.jpg: Arpeggios C# Min (II-6), Eb Maj (II-7), Eb Min (II-8), E Maj (II-9), E Min (II-10)
- IMG20251212084828.jpg: Dom 7ths Db (III-1), F (III-2), Ab (III-3), A (III-4)
- IMG20251212084833.jpg: Dim 7ths C (IV-1), Eb (IV-2), E (IV-3), Ab (IV-4)
- IMG20251212084848.jpg: Chromatics C (V-1), Eb (V-2), E (V-3), Ab (V-4)
- IMG20251212084852.jpg: Double Stop 3rds Bb (VI-1)
- IMG20251212084904.jpg: Double Stop Octaves D (VI-5), Gm Melodic (VI-6), Gm Harmonic (VI-7)
- IMG20251212084910.jpg: Double Stop 6ths Eb (VI-8)
"""

from PIL import Image, ImageEnhance
import os

# Output directory
OUTPUT_DIR = "public/sheet-music/cropped"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Target max dimension for web (keeps aspect ratio)
MAX_WIDTH = 800
JPEG_QUALITY = 75  # Good balance of quality/size


def auto_rotate(img):
    """Auto-rotate image based on EXIF orientation tag."""
    try:
        exif = img._getexif()
        if exif:
            orientation = exif.get(274)
            if orientation == 3:
                img = img.rotate(180, expand=True)
            elif orientation == 6:
                img = img.rotate(270, expand=True)
            elif orientation == 8:
                img = img.rotate(90, expand=True)
    except:
        pass
    return img


def crop_and_compress(img, scale_id, top_pct, bottom_pct, left_pct=0.03, right_pct=0.97):
    """Crop a portion of the image, compress, and save."""
    width, height = img.size
    
    left = int(width * left_pct)
    right = int(width * right_pct)
    top = int(height * top_pct)
    bottom = int(height * bottom_pct)
    
    cropped = img.crop((left, top, right, bottom))
    
    # Resize to max width while maintaining aspect ratio
    crop_w, crop_h = cropped.size
    if crop_w > MAX_WIDTH:
        ratio = MAX_WIDTH / crop_w
        new_size = (MAX_WIDTH, int(crop_h * ratio))
        cropped = cropped.resize(new_size, Image.LANCZOS)
    
    # Convert to RGB for JPEG
    if cropped.mode != 'RGB':
        cropped = cropped.convert('RGB')
    
    # Enhance slightly
    enhancer = ImageEnhance.Contrast(cropped)
    cropped = enhancer.enhance(1.1)
    
    # Save as JPEG for smaller file size
    output_filename = f"{scale_id.lower().replace('-', '_')}.jpg"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    cropped.save(output_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
    
    # Get file size
    file_size = os.path.getsize(output_path) / 1024  # KB
    print(f"  {scale_id}: {cropped.size[0]}x{cropped.size[1]} ({file_size:.1f}KB) -> {output_filename}")
    
    return output_path


def process_page(source_path, scales):
    """Process a single page and crop all scales from it."""
    print(f"\nProcessing: {source_path}")
    
    if not os.path.exists(source_path):
        print(f"  ERROR: File not found!")
        return
    
    img = Image.open(source_path)
    img = auto_rotate(img)
    
    print(f"  Original size: {img.size[0]}x{img.size[1]}")
    
    for scale_id, top_pct, bottom_pct in scales:
        crop_and_compress(img, scale_id, top_pct, bottom_pct)


# CORRECT PAGE MAPPING - verified order
PAGES = [
    # Page 1: Ab Major, G# Minor Melodic, G# Minor Harmonic
    ("sheet-music/IMG20251212084748.jpg", [
        ("I-1", 0.00, 0.31),    # Ab Major Scale
        ("I-2", 0.31, 0.64),    # G# Minor Melodic
        ("I-3", 0.64, 0.98),    # G# Minor Harmonic
    ]),
    
    # Page 2: Db Major, C# Minor Melodic, C# Minor Harmonic (THIS WAS WRONG - pages 2&3 swapped)
    ("sheet-music/IMG20251212084755.jpg", [
        ("I-7", 0.00, 0.31),    # Db Major Scale (was incorrectly mapped to I-4)
        ("I-8", 0.31, 0.64),    # C# Minor Melodic
        ("I-9", 0.64, 0.98),    # C# Minor Harmonic
    ]),
    
    # Page 3: C Major, C Minor Melodic, C Minor Harmonic
    ("sheet-music/IMG20251212084759.jpg", [
        ("I-4", 0.00, 0.31),    # C Major Scale (was incorrectly mapped to I-7)
        ("I-5", 0.31, 0.64),    # C Minor Melodic
        ("I-6", 0.64, 0.98),    # C Minor Harmonic
    ]),
    
    # Page 4: Eb Major, Eb Minor Melodic, Eb Minor Harmonic
    ("sheet-music/IMG20251212084805.jpg", [
        ("I-10", 0.00, 0.31),
        ("I-11", 0.31, 0.64),
        ("I-12", 0.64, 0.98),
    ]),
    
    # Page 5: E Major, E Minor Melodic, E Minor Harmonic
    ("sheet-music/IMG20251212084810.jpg", [
        ("I-13", 0.00, 0.31),
        ("I-14", 0.31, 0.64),
        ("I-15", 0.64, 0.98),
    ]),
    
    # Page 6: Arpeggios (5 on this page)
    ("sheet-music/IMG20251212084816.jpg", [
        ("II-1", 0.00, 0.19),
        ("II-2", 0.19, 0.38),
        ("II-3", 0.38, 0.57),
        ("II-4", 0.57, 0.76),
        ("II-5", 0.76, 0.98),
    ]),
    
    # Page 7: Arpeggios (5 on this page)
    ("sheet-music/IMG20251212084821.jpg", [
        ("II-6", 0.00, 0.19),
        ("II-7", 0.19, 0.38),
        ("II-8", 0.38, 0.57),
        ("II-9", 0.57, 0.76),
        ("II-10", 0.76, 0.98),
    ]),
    
    # Page 8: Dominant 7ths
    ("sheet-music/IMG20251212084828.jpg", [
        ("III-1", 0.00, 0.24),
        ("III-2", 0.24, 0.49),
        ("III-3", 0.49, 0.74),
        ("III-4", 0.74, 0.99),
    ]),
    
    # Page 9: Diminished 7ths
    ("sheet-music/IMG20251212084833.jpg", [
        ("IV-1", 0.00, 0.24),
        ("IV-2", 0.24, 0.49),
        ("IV-3", 0.49, 0.74),
        ("IV-4", 0.74, 0.99),
    ]),
    
    # Page 10: Chromatic Scales
    ("sheet-music/IMG20251212084848.jpg", [
        ("V-1", 0.00, 0.24),
        ("V-2", 0.24, 0.49),
        ("V-3", 0.49, 0.74),
        ("V-4", 0.74, 0.99),
    ]),
    
    # Page 11: Double Stop 3rds (full page)
    ("sheet-music/IMG20251212084852.jpg", [
        ("VI-1", 0.00, 0.99),
    ]),
    
    # Page 12: Double Stop Octaves
    ("sheet-music/IMG20251212084904.jpg", [
        ("VI-5", 0.00, 0.33),
        ("VI-6", 0.33, 0.66),
        ("VI-7", 0.66, 0.99),
    ]),
    
    # Page 13: Double Stop 6ths (full page)
    ("sheet-music/IMG20251212084910.jpg", [
        ("VI-8", 0.00, 0.99),
    ]),
]


def main():
    print("Sheet Music Cropping Script (with compression)")
    print("=" * 50)
    print(f"Max width: {MAX_WIDTH}px, JPEG quality: {JPEG_QUALITY}")
    print("=" * 50)
    
    for source_path, scales in PAGES:
        process_page(source_path, scales)
    
    print("\n" + "=" * 50)
    
    # Calculate total size
    total_size = 0
    files = [f for f in os.listdir(OUTPUT_DIR) if f.endswith('.jpg')]
    for f in files:
        total_size += os.path.getsize(os.path.join(OUTPUT_DIR, f))
    
    print(f"Created {len(files)} files, total size: {total_size/1024/1024:.1f}MB")
    print(f"Output directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
