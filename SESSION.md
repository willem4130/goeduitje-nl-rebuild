# Session State - Goeduitje.nl Rebuild

**Last Updated**: November 16, 2025, 14:55 UTC
**Session Type**: Complex
**Project**: Goeduitje.nl Next.js Rebuild
**Current Phase**: Instagram Integration Research Complete

---

## 🎯 Current Objective

Replace Instagram Graph API integration with EmbedSocial embed service due to Meta App Review requirements blocking direct API access.

---

## Progress Summary

### ✅ Completed Tasks - Current Session (Nov 16, 2025)

**Instagram Integration Investigation**:

- ✅ Attempted Instagram Graph API setup following Meta documentation
- ✅ Created Facebook App "goeduitjewebsite" (ID: 1169054208087897)
- ✅ Added Instagram Graph API product to app
- ✅ Generated Page Access Token with permissions (pages_show_list, pages_read_engagement, business_management)
- ✅ Identified Instagram Business Account ID: 17841467372861243
- ✅ Connected @goeduitje Instagram to Account Center
- ✅ Configured Instagram account in Meta Business Suite (owned by: Goeduitje)
- ✅ Documented complete setup process and troubleshooting steps

**Investigation Results**:

- ❌ Instagram Graph API blocked: Requires Meta App Review approval (weeks/months wait)
- ❌ Error: "Object with ID does not exist, cannot be loaded due to missing permissions" (error_subcode: 33)
- ❌ Despite proper setup, API permissions not granted without App Review

**Solution Research**:

- ✅ Researched Instagram embed service alternatives
- ✅ Compared EmbedSocial, SnapWidget, Elfsight
- ✅ **Recommended: EmbedSocial** (professional quality, free tier, no API maintenance)

**Documentation**:

- ✅ Updated CLAUDE.md with Instagram integration guidance
- ✅ Added "Third-Party Integrations" section documenting embed service recommendation
- ✅ Updated with rationale (Meta App Review barrier, reliability of embed services)

**Code Quality**:

- ✅ Ran code quality checks (typecheck, lint, format)
- ✅ Fixed 2 formatting issues (CLAUDE.md, site.webmanifest)
- ✅ All checks passing (0 errors, 1 pre-existing warning)

### 🚧 In Progress

- 🚧 EmbedSocial implementation guide (documented below)

### 📋 Pending Tasks - Next Steps

**Immediate**:

1. **Implement EmbedSocial** - Replace current Instagram component with embed
2. **Remove Instagram API code** - Clean up unused API route and dependencies
3. **Update .env** - Remove Instagram API credentials
4. **Test integration** - Verify feed displays correctly

**From Previous Sessions** (Still Pending): 5. Upgrade `top-navigation.tsx` - Add floating glassmorphism on scroll 6. Upgrade `impact-stats.tsx` - Editorial treatment with asymmetric layout 7. Build content pages: /onze-uitjes, /ons-verhaal, /onze-medewerkers, /onze-impact, /jullie-ervaringen 8. Add real photography and image assets 9. Extract Dutch content from Wix site 10. SEO optimization (meta tags, structured data) 11. Performance optimization (image optimization, lazy loading) 12. Accessibility audit (WCAG AA compliance) 13. Final testing and deployment

---

## 🔑 Key Decisions Made

### Current Session

**Instagram Integration Approach**

- **Choice**: Use EmbedSocial embed service instead of Instagram Graph API
- **Rationale**:
  - Instagram Graph API requires Meta App Review (weeks/months wait)
  - Even with proper setup, API returns permission errors (error_subcode 33)
  - Embed services are maintenance-free, reliable, and work immediately
  - EmbedSocial offers professional quality with free tier
- **Alternatives Considered**:
  - Instagram Graph API (blocked by App Review)
  - SnapWidget (has ads on free tier, less professional)
  - Elfsight (no free tier, $5/month)
  - Instagram oEmbed API (limited functionality)
- **Impact**: Faster implementation, no API maintenance, no review process, more reliable uptime

**Embed Service Selection**

- **Choice**: EmbedSocial over SnapWidget and Elfsight
- **Rationale**:
  - Free tier available (500 posts/month)
  - Professional appearance matches site quality
  - Responsive grids with customizable styling
  - GDPR compliant
  - 99.9% uptime
  - Auto-updates (no manual refresh needed)
- **Alternatives Considered**:
  - SnapWidget (simpler but basic, has ads)
  - Elfsight (better customization but requires $5/month)
- **Impact**: Professional quality without cost, matches editorial design system

**Documentation Strategy**

- **Choice**: Document Instagram integration recommendation in CLAUDE.md
- **Rationale**: Prevent future developers from attempting direct API integration again
- **Alternatives Considered**: Separate documentation file, inline code comments only
- **Impact**: Clear guidance for future development, saves time on re-investigation

---

## 📁 Files Modified

### Modified This Session

- `CLAUDE.md` (107 lines total, +7 lines):
  - Added "Third-Party Integrations" section
  - Documented Instagram feed recommendation (EmbedSocial)
  - Explained why direct API integration doesn't work (App Review requirement)
  - Formatted by Prettier

- `.env` (31 lines, attempted update):
  - Added Instagram credentials (blocked by API permissions)
  - INSTAGRAM_USER_ID="17841467372861243"
  - INSTAGRAM_ACCESS_TOKEN="[Page Access Token]"
  - Note: These will be removed when implementing EmbedSocial

**Total Session Changes**: 2 files modified

---

## 🏗️ Patterns & Architecture

### Instagram API Investigation (Attempted Pattern)

**What We Tried**:

```bash
# 1. Get Page Access Token
curl "https://graph.facebook.com/v21.0/me/accounts?fields=instagram_business_account,access_token&access_token=USER_TOKEN"

# 2. Try to fetch Instagram posts
curl "https://graph.facebook.com/v21.0/INSTAGRAM_ID/media?fields=id,media_type,media_url&access_token=PAGE_TOKEN"

# Result: Error 100, subcode 33 (missing permissions)
```

**Why It Failed**:

- Instagram Graph API requires App Review for production access
- Development mode only allows access to developer's own accounts
- Business accounts require approved app status
- Review process takes weeks and requires:
  - Business verification
  - Privacy policy
  - Use case documentation
  - App demonstration video

**Lesson Learned**:

- For "display Instagram feed" use case → Use embed services
- For "Instagram post automation" or "analytics" → Worth pursuing App Review
- Instagram Basic Display API is deprecated (as of Dec 2024)

### EmbedSocial Implementation Pattern (Planned)

**Component Structure**:

```tsx
// Replace current instagram-feed.tsx with embed
<div className="embedsocial-instagram" data-ref="[UNIQUE_ID]">
  <script>
    (function(d, s, id) {
      var js; if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://embedsocial.com/cdn/ht.js";
      d.getElementsByTagName("head")[0].appendChild(js);
    }(document, "script", "EmbedSocialHashtagScript"));
  </script>
</div>
```

**Next.js Integration Considerations**:

- Use `next/script` component for proper script loading
- Add `strategy="lazyOnload"` for performance
- Keep existing editorial styling wrapper
- Maintain scroll animations (ScrollReveal wrapper)

---

## 💡 Context & Notes

### Important Context

**Instagram Account Details**:

- Instagram handle: @goeduitje
- Instagram Business Account ID: 17841467372861243
- Facebook Page: "Goeduitje" (ID: 300895319781326)
- Connected in Meta Business Suite
- 212 followers (as of session)

**Facebook App Details**:

- App Name: goeduitjewebsite
- App ID: 1169054208087897
- Products: Instagram Graph API, Facebook Login
- Mode: Development (not approved for production)
- Created during this session

**Token Details** (will be deprecated after EmbedSocial implementation):

- User Access Token generated with permissions
- Page Access Token: EAAQnP6TL11kBP... (expires in 60 days)
- Instagram permissions attempted: instagram_basic, pages_show_list, pages_read_engagement

**Complete Setup Process Attempted**:

1. Created Facebook App
2. Added Instagram Graph API product
3. Converted Instagram to Business account
4. Connected Instagram to Facebook Page
5. Connected both to Account Center
6. Generated access tokens with permissions
7. Attempted API calls → Blocked by App Review requirement

### Gotchas & Edge Cases

1. **Instagram Graph API Trap**:
   - Meta documentation makes it seem simple
   - Reality: Requires App Review for any production use
   - Development mode only works for app developers' own accounts
   - Business accounts need approved app status
   - **Lesson**: Always check if App Review is required before investing time

2. **Instagram Account Types**:
   - Personal accounts: Can't use Graph API at all
   - Creator accounts: Limited API access
   - Business accounts: Full API access BUT requires App Review
   - **Current status**: @goeduitje is Business account, properly configured

3. **Meta Business Suite Connection**:
   - Showing Instagram in Business Suite ≠ API access granted
   - API access requires App Review approval
   - The "Login needed" warning was a red herring (fixed by re-auth)
   - Real blocker: App Review requirement

4. **Token Expiration**:
   - Short-lived tokens: 1 hour
   - Long-lived tokens: 60 days
   - Need to implement refresh mechanism for production
   - With embed services: No token management needed

5. **EmbedSocial Free Tier Limits**:
   - 500 posts/month (plenty for most use cases)
   - Watermark on free tier (small "Powered by EmbedSocial")
   - Can upgrade to remove watermark if needed
   - No ads or tracking on free tier

### Documentation References

**Current Session**:

- Instagram Graph API Docs: https://developers.facebook.com/docs/instagram-api/
- Meta App Review: https://developers.facebook.com/docs/app-review/
- EmbedSocial: https://embedsocial.com/
- SnapWidget: https://snapwidget.com/
- Elfsight: https://elfsight.com/instagram-feed-instashow/

**Meta Developer Tools Used**:

- Facebook Apps Dashboard: https://developers.facebook.com/apps/
- Graph API Explorer: https://developers.facebook.com/tools/explorer/
- Meta Business Suite: https://business.facebook.com/

**Project Documentation**:

- CLAUDE.md: Development guidelines and third-party integration recommendations
- Current Instagram component: `src/components/instagram-feed.tsx`
- Current API route: `src/app/api/instagram/route.ts` (to be removed)

---

## 📋 EmbedSocial Implementation Guide

### Step-by-Step Implementation Plan

**Phase 1: Setup EmbedSocial Account** (User action required):

1. Go to https://embedsocial.com/
2. Sign up for free account
3. Connect Instagram account (@goeduitje)
   - Click "Add Source" → Instagram
   - Login with Instagram credentials
   - Authorize EmbedSocial to access account
4. Create Instagram feed widget
   - Choose feed type: Grid or Masonry
   - Customize styling to match editorial design
   - Select number of posts to display
   - Configure layout (recommend: Masonry for editorial feel)
5. Copy embed code (will look like):
   ```html
   <div class="embedsocial-instagram" data-ref="UNIQUE_ID"></div>
   <script>
     (function(d, s, id){...}(document, "script", "EmbedSocialHashtagScript"));
   </script>
   ```
6. Save the UNIQUE_ID from the embed code

**Phase 2: Update Next.js Component** (I can do this):

1. Read current `src/components/instagram-feed.tsx`
2. Replace API fetch logic with embed code
3. Use `next/script` for proper script loading
4. Maintain editorial styling wrapper
5. Keep ScrollReveal animation wrapper
6. Add proper TypeScript types for embed

**Phase 3: Clean Up API Code** (I can do this):

1. Delete `src/app/api/instagram/route.ts`
2. Remove Instagram env variables from `.env`
3. Remove Instagram API dependencies if not used elsewhere
4. Update any references to API route

**Phase 4: Test & Verify**:

1. Run dev server
2. Navigate to homepage
3. Scroll to Instagram section
4. Verify feed displays correctly
5. Verify scroll animations still work
6. Check responsive behavior (mobile, tablet, desktop)
7. Verify editorial styling matches design system

### What I Can Do Automatically

**Once you provide the EmbedSocial UNIQUE_ID, I can**:

- ✅ Update `src/components/instagram-feed.tsx` with embed code
- ✅ Integrate with Next.js Script component
- ✅ Maintain existing scroll animations
- ✅ Keep editorial styling intact
- ✅ Delete `/app/api/instagram/route.ts`
- ✅ Remove Instagram credentials from `.env`
- ✅ Run code quality checks
- ✅ Test locally (if dev server running)

**What requires your manual action**:

- ❌ Creating EmbedSocial account (requires email verification)
- ❌ Connecting Instagram to EmbedSocial (requires Instagram login)
- ❌ Customizing feed appearance (visual preferences)
- ❌ Getting the embed code / UNIQUE_ID

### Expected Timeline

- **User Setup** (EmbedSocial account): 10-15 minutes
- **Code Implementation** (me): 5 minutes
- **Testing & Verification**: 5 minutes
- **Total**: ~25 minutes vs weeks for App Review

---

## 🔄 Continuation Prompt

**Use this to resume work in a new session:**

---

I'm continuing work on Goeduitje.nl rebuild. Here's where we left off:

**Current Goal**: Implement EmbedSocial for Instagram feed integration after discovering Instagram Graph API requires Meta App Review approval.

**Just Completed**:

- ✅ Comprehensive Instagram Graph API setup attempt
- ✅ Created Facebook App with Instagram Graph API product
- ✅ Connected @goeduitje Instagram Business account to Meta ecosystem
- ✅ Identified API blocker: App Review requirement (weeks/months wait)
- ✅ Researched embed service alternatives
- ✅ **Selected EmbedSocial** as best solution (professional, free tier, reliable)
- ✅ Updated CLAUDE.md with integration guidance
- ✅ All code quality checks passing

**Next Steps**:

1. **User: Create EmbedSocial account** and get embed code with UNIQUE_ID
2. **Me: Update instagram-feed.tsx** with EmbedSocial embed
3. **Me: Remove API code** (delete route, clean .env, remove dependencies)
4. **Test integration** - Verify feed displays with scroll animations
5. Continue with component upgrades (TopNavigation, ImpactStats)

**Context**:

- **Instagram account**: @goeduitje (Business account, 212 followers, ID: 17841467372861243)
- **Facebook App**: goeduitjewebsite (ID: 1169054208087897) - can be archived
- **Current implementation**: `src/components/instagram-feed.tsx` (editorial masonry grid)
- **Current API route**: `src/app/api/instagram/route.ts` (to be deleted)
- **Why embed service**: Meta App Review blocks direct API, embed services are maintenance-free
- **Design requirement**: Must maintain editorial styling and scroll animations

**Files to Focus On**:

- `src/components/instagram-feed.tsx` - Replace with EmbedSocial embed
- `src/app/api/instagram/route.ts` - Delete this file
- `.env` - Remove INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN
- `src/app/page.tsx` - Instagram section (keep ScrollReveal wrapper)

**Key Implementation Pattern**:

```tsx
// instagram-feed.tsx (planned update)
import Script from "next/script";

export function InstagramFeed() {
  return (
    <>
      <div className="embedsocial-instagram" data-ref="UNIQUE_ID">
        {/* Feed loads here */}
      </div>
      <Script
        src="https://embedsocial.com/cdn/ht.js"
        strategy="lazyOnload"
        id="EmbedSocialHashtagScript"
      />
    </>
  );
}
```

**Decision: EmbedSocial vs Direct API**:

- Direct API: Requires App Review, weeks wait, ongoing token management
- EmbedSocial: 10-minute setup, no maintenance, professional quality, free tier
- **Winner**: EmbedSocial (pragmatic choice for display-only use case)

**Questions/Blockers**:

- Waiting for user to create EmbedSocial account and provide UNIQUE_ID
- Once provided, implementation is straightforward (~5 minutes)

---

---

## 📚 Previous Session Notes

### Booking Page & Hero Updates (November 14, 2025, 09:46 UTC)

**Completed**:

- ✅ Built `/booking` page with 4 Dutch cooking workshops (realistic data, seat management)
- ✅ Updated hero with animated KPIs (41 uitjes, 516 deelnemers) using Framer Motion
- ✅ Removed secondary CTA, focused on single action
- ✅ Changed USPs to social impact messaging (statushouders, asielzoekers)
- ✅ Added scroll animations throughout landing page
- ✅ Fixed Framer Motion SSR error (useSpring → useMotionValue + animate)

**Key Decisions**:

- Use useMotionValue instead of useSpring for SSR compatibility
- Wrap sections in ScrollReveal instead of individual elements
- Use only standard shadcn/ui components (no custom booking UI)
- Dutch locale formatting for numbers

### High-End UI Upgrade (November 13, 2025, 16:15 UTC)

**Completed**:

- ✅ Upgraded from basic Shadcn to editorial magazine design
- ✅ Created comprehensive HIGH_END_UI_UPGRADE.md guide
- ✅ Refined typography, borders, shadows, spacing, animations
- ✅ Upgraded HeroVideo, WorkshopCarousel, TestimonialsCarousel

**Key Decisions**:

- Kinfolk/Bon Appétit editorial aesthetic
- Subtle 1px borders instead of 2px
- Editorial shadow system (0.02-0.08 opacity)
- Generous spacing (120px sections)
- Slower animations (300-700ms)

### Foundation Phase (November 13, 2025, 14:45 UTC)

**Completed**:

- ✅ Design system setup (oklch colors, Poppins typography)
- ✅ Framer Motion animation library
- ✅ Core components (hero-video, workshop-carousel, etc.)
- ✅ Restructured homepage to match wireframes

**Key Decisions**:

- oklch color format for Tailwind CSS 4
- Poppins fonts (Avenir has licensing issues)
- Sharp corners (0rem radius)
- Framer Motion for animations

---
