"""
Automated Sheet Music Verification using OCR
Uses image preprocessing for better text recognition.
"""

from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import pytesseract
import os
import re
import sys

# Set Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

CROPPED_DIR = "public/sheet-music/cropped"

# Expected text patterns for each question ID
# We look for keywords in the scale label text
EXPECTED = {
    "I-1": ("Ab", ["Ab", "A flat", "Apmajor"]),
    "I-2": ("G# Minor Melodic", ["G#", "G sharp", "melodic"]),
    "I-3": ("G# Minor Harmonic", ["G#", "G sharp", "harmonic"]),
    "I-4": ("C Major", ["C major", "Cmajor"]),
    "I-5": ("C Minor Melodic", ["C minor", "melodic"]),
    "I-6": ("C Minor Harmonic", ["C minor", "harmonic"]),
    "I-7": ("Db Major", ["Db", "D flat", "Dpmajor"]),
    "I-8": ("C# Minor Melodic", ["C#", "C sharp", "melodic"]),
    "I-9": ("C# Minor Harmonic", ["C#", "C sharp", "harmonic"]),
    "I-10": ("Eb Major", ["Eb", "E flat", "Epmajor"]),
    "I-11": ("Eb Minor Melodic", ["Eb", "E flat", "melodic"]),
    "I-12": ("Eb Minor Harmonic", ["Eb", "E flat", "harmonic"]),
    "I-13": ("E Major", ["E major", "Emajor"]),
    "I-14": ("E Minor Melodic", ["E minor", "melodic"]),
    "I-15": ("E Minor Harmonic", ["E minor", "harmonic"]),
    "II-1": ("Ab Major Arp", ["Ab", "arpeggio"]),
    "II-2": ("G# Minor Arp", ["G#", "arpeggio"]),
    "II-3": ("C Major Arp", ["C major", "arpeggio"]),
    "II-4": ("C Minor Arp", ["C minor", "arpeggio"]),
    "II-5": ("Db Major Arp", ["Db", "arpeggio"]),
    "II-6": ("C# Minor Arp", ["C#", "arpeggio"]),
    "II-7": ("Eb Major Arp", ["Eb", "arpeggio"]),
    "II-8": ("Eb Minor Arp", ["Eb", "arpeggio"]),
    "II-9": ("E Major Arp", ["E major", "arpeggio"]),
    "II-10": ("E Minor Arp", ["E minor", "arpeggio"]),
    "III-1": ("Dom 7th Db", ["Db", "dominant", "7"]),
    "III-2": ("Dom 7th F", ["F", "dominant", "7"]),
    "III-3": ("Dom 7th Ab", ["Ab", "dominant", "7"]),
    "III-4": ("Dom 7th A", ["A", "dominant", "7"]),
    "IV-1": ("Dim 7th C", ["C", "diminished", "7"]),
    "IV-2": ("Dim 7th Eb", ["Eb", "diminished", "7"]),
    "IV-3": ("Dim 7th E", ["E", "diminished", "7"]),
    "IV-4": ("Dim 7th Ab", ["Ab", "diminished", "7"]),
    "V-1": ("Chromatic C", ["C", "chromatic"]),
    "V-2": ("Chromatic Eb", ["Eb", "chromatic"]),
    "V-3": ("Chromatic E", ["E", "chromatic"]),
    "V-4": ("Chromatic Ab", ["Ab", "chromatic"]),
    "VI-1": ("Double 3rds Bb", ["Bb", "3rd", "double"]),
    "VI-5": ("Double Oct D", ["D", "octave"]),
    "VI-6": ("Double Oct Gm Mel", ["G", "octave", "melodic"]),
    "VI-7": ("Double Oct Gm Harm", ["G", "octave", "harmonic"]),
    "VI-8": ("Double 6ths Eb", ["Eb", "6th", "double"]),
}


def preprocess_image(img):
    """Apply preprocessing to improve OCR accuracy."""
    # Convert to grayscale
    gray = img.convert('L')
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(gray)
    gray = enhancer.enhance(2.0)
    
    # Increase sharpness
    enhancer = ImageEnhance.Sharpness(gray)
    gray = enhancer.enhance(2.0)
    
    # Resize for better OCR (2x)
    w, h = gray.size
    gray = gray.resize((w * 2, h * 2), Image.LANCZOS)
    
    # Binarize (threshold)
    gray = gray.point(lambda x: 0 if x < 180 else 255)
    
    return gray


def extract_text(image_path):
    """Extract text from image using OCR with preprocessing."""
    img = Image.open(image_path)
    
    # Try multiple regions - scale labels are usually on the left
    w, h = img.size
    regions = [
        ("left_margin", img.crop((0, 0, int(w * 0.25), h))),
        ("top_left", img.crop((0, 0, int(w * 0.3), int(h * 0.3)))),
        ("full_left", img.crop((0, 0, int(w * 0.4), h))),
    ]
    
    all_text = []
    
    for name, region in regions:
        processed = preprocess_image(region)
        
        # Try different PSM modes
        for psm in [6, 11, 3]:
            try:
                config = f'--psm {psm} --oem 3'
                text = pytesseract.image_to_string(processed, config=config)
                all_text.append(text)
            except:
                pass
    
    return "\n".join(all_text)


def check_match(text, patterns):
    """Check if any pattern is found in text."""
    text_lower = text.lower()
    matches = []
    for pattern in patterns:
        if pattern.lower() in text_lower:
            matches.append(pattern)
    return matches


def verify_all():
    """Verify all 42 scale images."""
    print("=" * 70)
    print("AUTOMATED SHEET MUSIC VERIFICATION")
    print("=" * 70)
    
    passed = []
    failed = []
    
    for qid, (expected_name, patterns) in EXPECTED.items():
        filename = f"{qid.lower().replace('-', '_')}.jpg"
        filepath = os.path.join(CROPPED_DIR, filename)
        
        if not os.path.exists(filepath):
            print(f"✗ {qid}: FILE NOT FOUND - {filepath}")
            failed.append((qid, "File not found", ""))
            continue
        
        text = extract_text(filepath)
        matches = check_match(text, patterns)
        
        if matches:
            print(f"✓ {qid}: PASS - Found: {matches}")
            passed.append(qid)
        else:
            # Extract first 80 chars for debugging
            clean_text = ' '.join(text.split())[:80]
            print(f"✗ {qid}: FAIL - Expected {expected_name}, found: '{clean_text}'")
            failed.append((qid, expected_name, clean_text))
    
    print("\n" + "=" * 70)
    print(f"RESULTS: {len(passed)} PASSED, {len(failed)} FAILED")
    print("=" * 70)
    
    if failed:
        print("\nFAILED TESTS - These need manual review or remapping:")
        for qid, expected, found in failed:
            print(f"  {qid}: expected '{expected}', got '{found[:50]}'")
    
    return len(failed) == 0


def analyze_one(qid):
    """Detailed analysis of a single image."""
    filename = f"{qid.lower().replace('-', '_')}.jpg"
    filepath = os.path.join(CROPPED_DIR, filename)
    
    print(f"\nDetailed analysis of {qid}")
    print("-" * 50)
    
    if not os.path.exists(filepath):
        print(f"ERROR: {filepath} not found")
        return
    
    text = extract_text(filepath)
    print(f"Extracted text:\n{text}")
    
    if qid in EXPECTED:
        expected_name, patterns = EXPECTED[qid]
        matches = check_match(text, patterns)
        print(f"\nExpected: {expected_name}")
        print(f"Patterns: {patterns}")
        print(f"Matches: {matches}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_one(sys.argv[1])
    else:
        success = verify_all()
        sys.exit(0 if success else 1)
