# Media Optimization Guide

Complete guide for processing and optimizing images and videos for Goeduitje.nl.

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Quick Reference](#quick-reference)
3. [Hero Video Processing](#hero-video-processing)
4. [Workshop Images](#workshop-images)
5. [Other Image Categories](#other-image-categories)
6. [Automation Scripts](#automation-scripts)
7. [Performance Targets](#performance-targets)

---

## Folder Structure

```
/public/
├── /videos/
│   └── /hero/
│       ├── hero-background.mp4          # Desktop (1920x1080)
│       ├── hero-background.webm         # Desktop WebM fallback
│       ├── hero-background-mobile.mp4   # Mobile vertical (1080x1920)
│       └── hero-background-mobile.webm  # Mobile WebM fallback
│
├── /images/
│   ├── /hero/
│   │   ├── hero-poster.jpg              # Desktop fallback (1920x1080)
│   │   ├── hero-poster.webp             # Desktop WebP
│   │   ├── hero-poster-mobile.jpg       # Mobile (1080x1920)
│   │   └── hero-poster-mobile.webp      # Mobile WebP
│   │
│   ├── /workshops/                      # 5 workshops, each with 2 versions
│   │   ├── [name].jpg                   # Full size (1520x1140, 4:3)
│   │   ├── [name].webp                  # WebP version
│   │   ├── [name]-thumb.jpg             # Thumbnail (760x570)
│   │   └── [name]-thumb.webp            # Thumbnail WebP
│   │
│   ├── /testimonials/                   # Square avatars
│   │   ├── [name].jpg                   # 600x600
│   │   └── [name].webp                  # WebP version
│   │
│   └── /impact/                         # 16:9 landscape images
│       ├── [name].jpg                   # 1600x900
│       └── [name].webp                  # WebP version
│
└── /raw-assets/                         # NOT served to web
    ├── /original-videos/                # Store original high-res videos here
    └── /original-images/                # Store original high-res images here
```

---

## Quick Reference

| Asset Type            | Dimensions      | Formats    | Quality    | Max Size |
| --------------------- | --------------- | ---------- | ---------- | -------- |
| Hero Video (Desktop)  | 1920x1080       | MP4 + WebM | 2-3 Mbps   | 5MB      |
| Hero Video (Mobile)   | 1080x1920       | MP4 + WebM | 1-1.5 Mbps | 3MB      |
| Hero Poster (Desktop) | 1920x1080       | JPG + WebP | 85%        | 250KB    |
| Hero Poster (Mobile)  | 1080x1920       | JPG + WebP | 80%        | 150KB    |
| Workshop Full         | 1520x1140 (4:3) | JPG + WebP | 85%        | 250KB    |
| Workshop Thumb        | 760x570 (4:3)   | JPG + WebP | 80%        | 80KB     |
| Testimonials          | 600x600 (1:1)   | JPG + WebP | 85%        | 100KB    |
| Impact Images         | 1600x900 (16:9) | JPG + WebP | 85%        | 200KB    |

---

## Hero Video Processing

### Prerequisites

Install FFmpeg (if not already installed):

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

### Step 1: Place Original Video

Place your high-resolution source video in:

```
/public/raw-assets/original-videos/hero-source.mp4
```

### Step 2: Process Desktop Version (1920x1080)

```bash
# Navigate to project root
cd /Users/willemvandenberg/Goeduitjeweb/goeduitje-nl-rebuild

# MP4 (H.264) - Desktop
ffmpeg -i public/raw-assets/original-videos/hero-source.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -maxrate 3M \
  -bufsize 6M \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -an \
  -t 20 \
  public/videos/hero/hero-background.mp4

# WebM (VP9) - Desktop fallback
ffmpeg -i public/raw-assets/original-videos/hero-source.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 \
  -b:v 2M \
  -crf 30 \
  -an \
  -t 20 \
  public/videos/hero/hero-background.webm
```

### Step 3: Process Mobile Version (1080x1920 - Portrait)

```bash
# MP4 (H.264) - Mobile
ffmpeg -i public/raw-assets/original-videos/hero-source.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 \
  -preset slow \
  -crf 26 \
  -maxrate 1.5M \
  -bufsize 3M \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -an \
  -t 20 \
  public/videos/hero/hero-background-mobile.mp4

# WebM (VP9) - Mobile fallback
ffmpeg -i public/raw-assets/original-videos/hero-source.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 \
  -b:v 1M \
  -crf 33 \
  -an \
  -t 20 \
  public/videos/hero/hero-background-mobile.webm
```

### Step 4: Extract Poster Images

```bash
# Desktop poster (extract frame at 2 seconds)
ffmpeg -i public/videos/hero/hero-background.mp4 \
  -ss 00:00:02 \
  -vframes 1 \
  -q:v 2 \
  public/images/hero/hero-poster.jpg

# Mobile poster
ffmpeg -i public/videos/hero/hero-background-mobile.mp4 \
  -ss 00:00:02 \
  -vframes 1 \
  -q:v 2 \
  public/images/hero/hero-poster-mobile.jpg
```

### Step 5: Convert Posters to WebP

```bash
# Install sharp-cli if needed
npm install -g sharp-cli

# Desktop WebP
npx sharp-cli \
  -i public/images/hero/hero-poster.jpg \
  -o public/images/hero/hero-poster.webp \
  --quality 85 \
  --format webp

# Mobile WebP
npx sharp-cli \
  -i public/images/hero/hero-poster-mobile.jpg \
  -o public/images/hero/hero-poster-mobile.webp \
  --quality 80 \
  --format webp
```

### FFmpeg Options Explained

- `-vf scale=...` - Resize video maintaining aspect ratio
- `-c:v libx264` - Use H.264 codec (widely supported)
- `-preset slow` - Better compression (slower encoding)
- `-crf 23-26` - Constant Rate Factor (lower = better quality)
- `-maxrate` - Maximum bitrate cap
- `-bufsize` - Rate control buffer
- `-pix_fmt yuv420p` - Pixel format for compatibility
- `-movflags +faststart` - Enable web streaming
- `-an` - Remove audio track
- `-t 20` - Trim to 20 seconds

---

## Workshop Images

### Workshop List

1. `kookworkshop` - Cooking workshop
2. `stadsspel` - City game
3. `the-game` - The Game activity
4. `koffie-thee` - Coffee/Tea tasting
5. `beachvolleybal` - Beach volleyball

### Image Specifications

- **Aspect Ratio**: 4:3 (editorial design system requirement)
- **Full Size**: 1520x1140 (2x retina for 760px display width)
- **Thumbnail**: 760x570 (actual display size)
- **Format**: JPG + WebP
- **DPI**: 72 (web standard)

### Processing Steps

#### Step 1: Place Original Images

Place high-resolution source images in:

```
/public/raw-assets/original-images/kookworkshop-original.jpg
/public/raw-assets/original-images/stadsspel-original.jpg
... etc
```

#### Step 2: Process Each Workshop Image

Using **sharp-cli** (recommended for batch processing):

```bash
# Install sharp-cli globally
npm install -g sharp-cli

# Process full-size version (1520x1140)
npx sharp-cli \
  -i public/raw-assets/original-images/kookworkshop-original.jpg \
  -o public/images/workshops/kookworkshop.jpg \
  --resize 1520 1140 \
  --fit cover \
  --quality 85

# Generate WebP version
npx sharp-cli \
  -i public/images/workshops/kookworkshop.jpg \
  -o public/images/workshops/kookworkshop.webp \
  --quality 85 \
  --format webp

# Process thumbnail (760x570)
npx sharp-cli \
  -i public/raw-assets/original-images/kookworkshop-original.jpg \
  -o public/images/workshops/kookworkshop-thumb.jpg \
  --resize 760 570 \
  --fit cover \
  --quality 80

# Generate thumbnail WebP
npx sharp-cli \
  -i public/images/workshops/kookworkshop-thumb.jpg \
  -o public/images/workshops/kookworkshop-thumb.webp \
  --quality 80 \
  --format webp
```

#### Alternative: Using ImageMagick

```bash
# Install ImageMagick
brew install imagemagick  # macOS

# Full size
convert public/raw-assets/original-images/kookworkshop-original.jpg \
  -resize 1520x1140^ \
  -gravity center \
  -extent 1520x1140 \
  -quality 85 \
  -strip \
  public/images/workshops/kookworkshop.jpg

# Thumbnail
convert public/raw-assets/original-images/kookworkshop-original.jpg \
  -resize 760x570^ \
  -gravity center \
  -extent 760x570 \
  -quality 80 \
  -strip \
  public/images/workshops/kookworkshop-thumb.jpg

# Convert to WebP
cwebp -q 85 public/images/workshops/kookworkshop.jpg \
  -o public/images/workshops/kookworkshop.webp
```

### Batch Processing All Workshops

Create a bash script `/scripts/process-workshops.sh`:

```bash
#!/bin/bash

WORKSHOPS=("kookworkshop" "stadsspel" "the-game" "koffie-thee" "beachvolleybal")

for workshop in "${WORKSHOPS[@]}"; do
  echo "Processing $workshop..."

  # Full size JPG
  npx sharp-cli \
    -i "public/raw-assets/original-images/${workshop}-original.jpg" \
    -o "public/images/workshops/${workshop}.jpg" \
    --resize 1520 1140 \
    --fit cover \
    --quality 85

  # Full size WebP
  npx sharp-cli \
    -i "public/images/workshops/${workshop}.jpg" \
    -o "public/images/workshops/${workshop}.webp" \
    --quality 85 \
    --format webp

  # Thumbnail JPG
  npx sharp-cli \
    -i "public/raw-assets/original-images/${workshop}-original.jpg" \
    -o "public/images/workshops/${workshop}-thumb.jpg" \
    --resize 760 570 \
    --fit cover \
    --quality 80

  # Thumbnail WebP
  npx sharp-cli \
    -i "public/images/workshops/${workshop}-thumb.jpg" \
    -o "public/images/workshops/${workshop}-thumb.webp" \
    --quality 80 \
    --format webp

  echo "✓ $workshop complete"
done

echo "All workshops processed!"
```

Run with:

```bash
chmod +x scripts/process-workshops.sh
./scripts/process-workshops.sh
```

---

## Other Image Categories

### Testimonials (Square 1:1)

```bash
# Process testimonial avatar (600x600)
npx sharp-cli \
  -i public/raw-assets/original-images/lisa-original.jpg \
  -o public/images/testimonials/lisa.jpg \
  --resize 600 600 \
  --fit cover \
  --quality 85

# WebP version
npx sharp-cli \
  -i public/images/testimonials/lisa.jpg \
  -o public/images/testimonials/lisa.webp \
  --quality 85 \
  --format webp
```

### Impact Images (16:9 Landscape)

```bash
# Process impact image (1600x900)
npx sharp-cli \
  -i public/raw-assets/original-images/yemen-original.jpg \
  -o public/images/impact/yemen.jpg \
  --resize 1600 900 \
  --fit cover \
  --quality 85

# WebP version
npx sharp-cli \
  -i public/images/impact/yemen.jpg \
  -o public/images/impact/yemen.webp \
  --quality 85 \
  --format webp
```

---

## Automation Scripts

### Complete Optimization Script

Create `/scripts/optimize-all-media.sh`:

```bash
#!/bin/bash

echo "🎬 Starting media optimization..."

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Install with: brew install ffmpeg"
    exit 1
fi

# Check if sharp-cli is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Install Node.js first."
    exit 1
fi

echo ""
echo "📹 Processing hero videos..."

# Process hero videos (if source exists)
if [ -f "public/raw-assets/original-videos/hero-source.mp4" ]; then
    echo "  → Desktop MP4..."
    ffmpeg -i public/raw-assets/original-videos/hero-source.mp4 \
      -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
      -c:v libx264 -preset slow -crf 23 -maxrate 3M -bufsize 6M \
      -pix_fmt yuv420p -movflags +faststart -an -t 20 \
      public/videos/hero/hero-background.mp4 -y

    echo "  → Desktop WebM..."
    ffmpeg -i public/raw-assets/original-videos/hero-source.mp4 \
      -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
      -c:v libvpx-vp9 -b:v 2M -crf 30 -an -t 20 \
      public/videos/hero/hero-background.webm -y

    echo "  → Mobile MP4..."
    ffmpeg -i public/raw-assets/original-videos/hero-source.mp4 \
      -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
      -c:v libx264 -preset slow -crf 26 -maxrate 1.5M -bufsize 3M \
      -pix_fmt yuv420p -movflags +faststart -an -t 20 \
      public/videos/hero/hero-background-mobile.mp4 -y

    echo "  → Extracting posters..."
    ffmpeg -i public/videos/hero/hero-background.mp4 -ss 00:00:02 -vframes 1 -q:v 2 \
      public/images/hero/hero-poster.jpg -y
    ffmpeg -i public/videos/hero/hero-background-mobile.mp4 -ss 00:00:02 -vframes 1 -q:v 2 \
      public/images/hero/hero-poster-mobile.jpg -y

    echo "  → Converting posters to WebP..."
    npx sharp-cli -i public/images/hero/hero-poster.jpg \
      -o public/images/hero/hero-poster.webp --quality 85 --format webp
    npx sharp-cli -i public/images/hero/hero-poster-mobile.jpg \
      -o public/images/hero/hero-poster-mobile.webp --quality 80 --format webp

    echo "✓ Hero videos processed"
else
    echo "⚠️  Hero source video not found at public/raw-assets/original-videos/hero-source.mp4"
fi

echo ""
echo "🎨 Processing workshop images..."

WORKSHOPS=("kookworkshop" "stadsspel" "the-game" "koffie-thee" "beachvolleybal")

for workshop in "${WORKSHOPS[@]}"; do
    SOURCE="public/raw-assets/original-images/${workshop}-original.jpg"

    if [ -f "$SOURCE" ]; then
        echo "  → Processing $workshop..."

        # Full size
        npx sharp-cli -i "$SOURCE" \
          -o "public/images/workshops/${workshop}.jpg" \
          --resize 1520 1140 --fit cover --quality 85
        npx sharp-cli -i "public/images/workshops/${workshop}.jpg" \
          -o "public/images/workshops/${workshop}.webp" \
          --quality 85 --format webp

        # Thumbnail
        npx sharp-cli -i "$SOURCE" \
          -o "public/images/workshops/${workshop}-thumb.jpg" \
          --resize 760 570 --fit cover --quality 80
        npx sharp-cli -i "public/images/workshops/${workshop}-thumb.jpg" \
          -o "public/images/workshops/${workshop}-thumb.webp" \
          --quality 80 --format webp

        echo "    ✓ $workshop complete"
    else
        echo "    ⚠️  $workshop source not found"
    fi
done

echo ""
echo "✅ Media optimization complete!"
echo ""
echo "📊 File sizes:"
du -sh public/videos/hero/* 2>/dev/null || echo "  No videos processed"
du -sh public/images/workshops/* 2>/dev/null || echo "  No workshop images processed"
```

Make executable and run:

```bash
chmod +x scripts/optimize-all-media.sh
./scripts/optimize-all-media.sh
```

---

## Performance Targets

### Loading Performance

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Total Page Weight**: < 3MB initial load
- **Hero Video Load Time**: < 3s (with poster fallback)

### File Size Targets

- Hero video (desktop): 3-5MB
- Hero video (mobile): 2-3MB
- Workshop images (full): 150-250KB (JPG), 80-150KB (WebP)
- Workshop thumbnails: 50-80KB (JPG), 30-50KB (WebP)
- Poster images: < 250KB (JPG), < 150KB (WebP)

### Quality Settings

- Videos: CRF 23-26 (H.264), CRF 30-33 (VP9)
- Images: 80-85% JPEG quality
- WebP: 80-85% quality (usually 30-50% smaller than JPG)
- DPI: 72 (web standard, strip all metadata)

### Optimization Checklist

- [ ] Original assets placed in `/public/raw-assets/`
- [ ] Hero videos processed (MP4 + WebM, desktop + mobile)
- [ ] Hero posters extracted and converted to WebP
- [ ] All 5 workshop images processed (full + thumb, JPG + WebP)
- [ ] Testimonial avatars processed (if applicable)
- [ ] Impact images processed (if applicable)
- [ ] File sizes verified against targets
- [ ] Visual quality checked on retina displays
- [ ] Tested on mobile devices
- [ ] Lighthouse performance score > 90

---

## Testing Media Assets

### Visual Quality Check

```bash
# Open processed images in browser
open public/images/workshops/kookworkshop.jpg
open public/images/workshops/kookworkshop.webp
```

### File Size Check

```bash
# Check all workshop image sizes
ls -lh public/images/workshops/

# Check video sizes
ls -lh public/videos/hero/
```

### Browser Testing

1. Start dev server: `bun run dev`
2. Open homepage with hero video
3. Test video playback on desktop and mobile
4. Verify WebP images load in Chrome/Edge
5. Verify JPG fallback loads in older browsers
6. Check Lighthouse performance score

---

## Troubleshooting

### Video Not Playing

- Ensure `-movflags +faststart` is set (enables streaming)
- Check video codec: must be H.264 baseline/main profile
- Verify pixel format: `yuv420p` for compatibility

### Images Too Large

- Reduce quality: use 75-80% instead of 85%
- Ensure dimensions are correct (not upscaled)
- Use WebP format (30-50% smaller than JPG)
- Strip metadata: `--strip` flag with ImageMagick

### Blurry on Retina Displays

- Ensure 2x resolution (1520px for 760px display)
- Check source image quality
- Avoid upscaling low-res images

### WebP Not Loading

- Ensure browser supports WebP (Chrome, Edge, Firefox, Safari 14+)
- Implement JPG fallback with `<picture>` element
- Check file permissions

---

## Additional Resources

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Format Guide](https://developers.google.com/speed/webp)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Performance Best Practices](https://web.dev/fast/)
