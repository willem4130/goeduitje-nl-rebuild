# Goeduitje.nl Wireframes

This document describes the wireframes provided for the rebuild.

## Wireframe #1: Homepage

**File**: `wireframe-homepage.png` (provided by user)

### Navigation (Top)

- Goeduitje logo (HOME link)
- Main menu items:
  - onze uitjes
  - ons verhaal
  - onze medewerkers
  - onze impact
  - jullie ervaringen
  - social icons + cal icon

### Layout Sections:

1. **Hero Section**
   - Video background
   - USPs / elevator pitch overlays
   - CTAs: "Stel je uitje samen" + "schrijf je in voor open"

2. **KPI Dashboard** (top right)
   - Shows: "impact -> meer info met aparte pagina voor de reports"
   - Impact metrics display

3. **Workshop Types Section**
   - List of uitjes (activities):
     - Kookworkshop
     - Stadsspel
     - Game
     - Koffie & thee workshop
     - Beachvolleybal workshop

4. **Workshop Configurator**
   - "Stel je uitje samen" form
   - "Schrijf je in voor open" signup

5. **Impact Section**
   - Locations mentioned: Jemen, Syrie, Palestina
   - Instagram integration
   - Display: "insta login: guus@goeduitje.nl / Habibi2022/"

6. **Social Media Display**
   - Instagram feed integration

7. **Contact Section**
   - CTA: "heeft slimme form"

---

## Wireframe #2: Onze Uitjes Page

**File**: `wireframe-uitjes.png` (provided by user)

### Page Title

- "onze uitjes"

### Content Structure

1. **Workshop Carousel**
   - Horizontal scrolling carousel showing all workshop types
   - Workshop cards with images

2. **Workshop Categories**
   - Subpage per uitje-type:
     - Each workshop has its own detail page
   - Subpage per uitje-stad (not in frontend initially):
     - City-specific pages (may be generated dynamically)

3. **Call-to-Actions**
   - "benoemen bedrijf/particulier -> link naar configurator"
     - Button to access workshop configurator
   - "Meld je aan voor open workshop -via de agenda"
     - Link to open workshop registration through calendar

---

## Design Notes from Wireframes

### Color Coding (in wireframes)

- **Goeduitje logo**: Green text
- **Menu items**:
  - "onze uitjes" - Orange/red
  - "ons verhaal" - Blue
  - "onze medewerkers" - Gray/slate
  - "onze impact" - Gray
  - "jullie ervaringen" - Gray
- **Social icons + cal icon**: Gray (top right)
- **Hero elements**: Orange/yellow annotations
- **Impact dashboard**: Orange text

### Layout Observations

- Clean, organized structure
- Clear hierarchy with large headings
- Workshop types prominently displayed
- Strong CTAs for booking/configuration
- Integration of social proof (Instagram)
- Impact storytelling emphasized

---

## Implementation Priorities

### Phase 1: Core Structure

1. Navigation with all menu items
2. Hero section with video background
3. Workshop preview/carousel
4. Configurator integration (already exists)
5. Contact form

### Phase 2: Content Pages

1. Onze Uitjes page with carousel
2. Workshop detail pages (dynamic)
3. Ons Verhaal page
4. Onze Medewerkers page
5. Onze Impact page
6. Jullie Ervaringen page

### Phase 3: Advanced Features

1. Impact dashboard/KPI display
2. Instagram feed integration
3. Open workshop signup via Cal.com
4. City-specific subpages (if needed)

---

## Key User Flows

### Flow 1: Book a Custom Workshop

1. Land on homepage
2. See workshop types
3. Click "Stel je uitje samen"
4. Configure workshop (type, participants, location, date)
5. Submit booking request
6. Receive confirmation

### Flow 2: Sign Up for Open Workshop

1. Land on homepage or Onze Uitjes
2. Click "Schrijf je in voor open"
3. View calendar with available slots
4. Select date/time
5. Fill in details
6. Submit registration

### Flow 3: Browse Workshops

1. Click "Onze Uitjes" in menu
2. View carousel of all workshops
3. Click on specific workshop
4. Read details on workshop page
5. Click CTA to configure or signup

### Flow 4: Learn About Impact

1. See impact stats on homepage
2. Click for more info
3. View dedicated impact page
4. See projects in Yemen, Syria, Palestine
5. Understand social mission

---

## Technical Implementation Notes

### Components Needed (from wireframes)

- ✅ Top navigation with menu items
- ⬜ Hero with video background
- ⬜ Workshop carousel (horizontal scroll)
- ✅ Workshop configurator (exists)
- ⬜ Impact stats/KPI display
- ✅ Instagram feed (exists)
- ⬜ Testimonials section ("jullie ervaringen")
- ✅ Contact form (exists)
- ⬜ Cal.com integration for open workshops
- ⬜ Dynamic workshop detail pages

### Pages Needed

- ⬜ `/` - Homepage (restructure existing)
- ⬜ `/onze-uitjes` - Workshops listing
- ⬜ `/onze-uitjes/[workshop]` - Workshop details
- ⬜ `/ons-verhaal` - Story page
- ⬜ `/onze-medewerkers` - Team page
- ⬜ `/onze-impact` - Impact page
- ⬜ `/jullie-ervaringen` - Testimonials page
- ✅ `/contact` - Contact page (exists)

---

## Annotations from Wireframes

**Homepage**:

- "hero video background"
- "USPs / elevator pitch"
- "Stel je uitje samen" + "schrijf je in voor open"
- "KPI dashboard: impact -> meer info met aparte pagina voor de reports"
- "Jemen, Syrie, Palestina" (impact locations)
- "insta login: guus@goeduitje.nl / Habibi2022/"
- "CTA: heeft slimme form"

**Onze Uitjes Page**:

- "carrousel met uitjes"
- "subpage uitje-type"
- "subpage per uitje-stad (niet in frontend)"
- "benoemen bedrijf/particulier -> link naar configurator"
- "Meld je aan voor open workshop -via de agenda"

---

**Document Status**: Complete
**Last Updated**: November 13, 2025
**Source**: User-provided wireframe images
