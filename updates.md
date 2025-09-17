# Updates Required

## 1. PlayerTypesManager - Add Casino Selection
- Add casino list management within each player type
- Allow adding/removing casinos directly from player type form
- Show selected casinos in the player type list

## 2. Change "Blog" to "Related Articles"
Files to update:
- src/utils/language.ts - All translations
- src/pages/admin.ts - Admin interface
- src/index.tsx - Navigation

## 3. Home Page Promotional Sections
Replace "Best Bonuses" and "24/7 Support" with more neutral content

## 4. Change Button Text
Change all "Visit Casino" buttons to "Play Now" (立即遊戲)

## 5. Blog Page Redesign
- Add "All Articles" category
- Categories sidebar on left (desktop) / top (mobile)
- Sort by newest first

## 6. Add Article Publish Date
- Add published_at field to blog posts
- Display date on article cards

## 7. Blog Category Management
- Add/delete categories in admin
- Set category visibility

## 8. Contact Form Submissions
- Create contact_submissions table
- Store form data in database
- Add admin view for submissions

## 9. Logo Upload Feature
- Add file upload to Cloudflare R2
- Update casino form with upload button