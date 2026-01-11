# Smart Garden App - Frontend

A Smart Gardening Web App for home gardeners, especially Indian parents doing rooftop/terrace gardening.

## Features

- 🏠 **Landing Page** with beginner/experienced mode toggle
- 📸 **Soil Upload** with image preview and analysis
- 📊 **Dashboard** with plant recommendations, weather alerts, and care instructions
- 💬 **Chatbot** with WhatsApp-style UI for gardening advice

## Tech Stack

- React 18+
- Vite
- Tailwind CSS
- React Router
- Lucide React (icons)
- React Hot Toast (notifications)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
smart-garden-app/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── PlantCard.jsx
│   │   ├── WeatherCard.jsx
│   │   └── ChatMessage.jsx
│   ├── pages/            # Page components
│   │   ├── Landing.jsx
│   │   ├── Dashboard.jsx
│   │   ├── SoilUpload.jsx
│   │   └── Chatbot.jsx
│   ├── context/          # React Context
│   │   └── UserContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
└── package.json
```

## Pages

- **/** - Landing page with feature cards
- **/upload** - Soil image upload page
- **/dashboard** - Main dashboard with recommendations
- **/chatbot** - AI chatbot interface

## Current Status

✅ All UI components complete
✅ Routing set up
✅ User preferences (beginner/experienced) stored in Context + localStorage
✅ Mock data for demonstration
⏳ Backend integration pending (Section 2 & 3)

## Next Steps

1. Connect to backend API for soil analysis
2. Integrate weather API
3. Connect chatbot to Gemini API
4. Add marketplace page

## Notes

- Currently uses mock data for demonstration
- All features are UI-ready and waiting for backend integration
- Fully responsive design
- Parent-friendly, simple UI
