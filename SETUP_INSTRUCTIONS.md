# Quick Setup Instructions

## Prerequisites

Make sure you have Node.js installed (version 16 or higher).
Download from: https://nodejs.org/

## Installation Steps

1. **Open Terminal/Command Prompt in the project folder:**
   ```bash
   cd C:\Users\Chiranjivi\Desktop\smart-garden-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be running at `http://localhost:5173` (or the port shown in terminal)
   - You should see the landing page!

## What's Included

✅ Complete React frontend with all pages
✅ Tailwind CSS styling (green/nature theme)
✅ React Router for navigation
✅ User context for beginner/experienced mode
✅ All components and pages ready

## Pages Available

- **/** - Landing page with toggle and feature cards
- **/upload** - Soil image upload with preview
- **/dashboard** - Dashboard with plant recommendations (mock data)
- **/chatbot** - WhatsApp-style chatbot UI (mock responses)

## Current Status

- ✅ All UI components complete
- ✅ Fully responsive design
- ✅ Mock data for demonstration
- ⏳ Backend integration pending (for real API calls)

## Next Steps

Once you have the frontend running, you can:
1. Test all pages and navigation
2. Try uploading a soil image (currently shows mock response)
3. Check the dashboard with mock recommendations
4. Test the chatbot with mock responses
5. Proceed to Section 2 (ML/Backend) for real API integration

## Troubleshooting

**If npm install fails:**
- Make sure Node.js is installed: `node --version`
- Try: `npm cache clean --force` then `npm install` again

**If the dev server doesn't start:**
- Make sure port 5173 is not in use
- Check for any error messages in the terminal

**For any issues:**
- Check that all files are in the correct folders
- Verify package.json has all dependencies
- Make sure you're in the project root directory

Enjoy building your Smart Garden App! 🌱
