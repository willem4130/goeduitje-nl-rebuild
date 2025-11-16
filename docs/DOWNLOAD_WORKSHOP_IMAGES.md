# Workshop Images - Download Guide

## Images Needed

Download these 4 images from Unsplash or Pexels (free, no attribution required):

### 1. The Game (Team Challenge)

**Filename**: `the-game.jpg`
**Search terms**: "team building challenge" OR "group activity indoor"
**Recommended sources**:

- https://unsplash.com/s/photos/team-building-game
- https://www.pexels.com/search/team%20building%20game/

**What to look for**: Group of people doing team activities, strategy games, indoor team challenges

### 2. Coffee & Tea Workshop

**Filename**: `koffie-thee.jpg`
**Search terms**: "coffee brewing workshop" OR "barista training" OR "tea ceremony"
**Recommended sources**:

- https://unsplash.com/s/photos/coffee-brewing-workshop
- https://www.pexels.com/search/coffee%20workshop/

**What to look for**: Hands pouring coffee, coffee beans, espresso machine, tea brewing setup

### 3. Beach Volleyball

**Filename**: `beachvolleybal.jpg`
**Search terms**: "beach volleyball" OR "beach sports team"
**Recommended sources**:

- https://unsplash.com/s/photos/beach-volleyball
- https://www.pexels.com/search/beach%20volleyball/

**What to look for**: People playing volleyball on beach, outdoor team sports, beach activities

### 4. Design T-Shirt Workshop

**Filename**: `design-tshirt.jpg`
**Search terms**: "t-shirt design workshop" OR "screen printing" OR "textile design"
**Recommended sources**:

- https://unsplash.com/s/photos/tshirt-design
- https://www.pexels.com/search/tshirt%20printing/

**What to look for**: People designing clothes, screen printing, creative textile work, art workshop

## Download Instructions

### Option 1: Unsplash (Recommended)

1. Go to https://unsplash.com
2. Search for the specific workshop type
3. Find a high-quality image (at least 1920x1080)
4. Click the download button
5. Save to `/public/images/workshops/` with the exact filename above

### Option 2: Pexels

1. Go to https://www.pexels.com
2. Search for the workshop type
3. Select "Free" filter
4. Choose "Large" size (at least 1920x1080)
5. Download and save to `/public/images/workshops/`

### Quick Download Script

Once you have the URLs, you can download them directly:

```bash
# Example - replace URLs with your chosen images
cd /Users/willemvandenberg/Goeduitjeweb/goeduitje-nl-rebuild/public/images/workshops

# Download The Game image
curl -L "YOUR_UNSPLASH_URL_HERE/download?force=true" -o the-game.jpg

# Download Coffee & Tea image
curl -L "YOUR_UNSPLASH_URL_HERE/download?force=true" -o koffie-thee.jpg

# Download Beach Volleyball image
curl -L "YOUR_UNSPLASH_URL_HERE/download?force=true" -o beachvolleybal.jpg

# Download T-Shirt Design image
curl -L "YOUR_UNSPLASH_URL_HERE/download?force=true" -o design-tshirt.jpg
```

## Image Specifications

- **Format**: JPG
- **Minimum size**: 1920x1080px (Full HD)
- **Aspect ratio**: 4:3 or 16:9
- **File size**: < 500KB (will be optimized by Next.js)
- **Quality**: High resolution, well-lit, professional

## After Downloading

Once all images are downloaded, the website will automatically:

1. Optimize them via Next.js Image component
2. Generate responsive variants
3. Add lazy loading
4. Create blur placeholders

No code changes needed - just drop the images in `/public/images/workshops/`!

## Verification

To verify all images are working:

```bash
ls -lh /Users/willemvandenberg/Goeduitjeweb/goeduitje-nl-rebuild/public/images/workshops/
```

You should see:

- the-game.jpg
- koffie-thee.jpg
- beachvolleybal.jpg
- design-tshirt.jpg
- workshop 1.mp4 (existing)
- workshop 2.mp4 (existing)

## Troubleshooting

**Issue**: Image still showing 404

- **Solution**: Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**Issue**: Image looks blurry

- **Solution**: Download larger resolution (at least 1920x1080)

**Issue**: Wrong aspect ratio

- **Solution**: Look for landscape orientation images (horizontal, not vertical)

---

**License Note**: Both Unsplash and Pexels offer images that are:

- Free for commercial use
- No attribution required
- Can be used on websites

Perfect for your Goeduitje.nl project!
