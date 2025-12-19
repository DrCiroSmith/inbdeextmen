# INBDE Study Platform - Deployment Guide

## Overview
This guide covers deploying the INBDE Study Platform with 3 fully configured playlists.

## Prerequisites
- Node.js 18+ installed
- GitHub account
- Gemini API key

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to test locally.

## Testing the Implementation

### Configured Playlists
The following playlists have hardcoded video URLs for maximum accuracy:

1. **Head & Neck Anatomy** (20 videos)
2. **Pharmacology** (10 videos)
3. **Oral Radiology** (7 videos)

### Test Steps
1. Select one of the configured playlists from the homepage
2. Click "Generate Study Data"
3. Verify that all videos are listed
4. Check that each video has:
   - Correct title
   - Working "WATCH VIDEO" link
   - Download JSON button
   - Copy JSON button
5. Test "Download All" functionality

## Production Build

### Build the Application
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Deployment Options

### Option 1: GitHub Pages

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json**:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/inbdeextmen"
}
```

3. **Deploy**:
```bash
npm run deploy
```

### Option 2: Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Option 3: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

## Environment Variables in Production

### GitHub Pages
- Not recommended for sensitive API keys
- Consider using a backend proxy

### Vercel/Netlify
1. Go to project settings
2. Add environment variable:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key
3. Redeploy the application

## Adding More Playlists

To add more playlists with hardcoded URLs:

1. **Scrape video URLs** from the YouTube playlist
2. **Add constant** to `services/geminiService.ts`:
```typescript
const NEW_PLAYLIST_VIDEOS = [
  { title: "Video 1", url: "https://youtube.com/..." },
  // ... more videos
];
```

3. **Update generatePrompt** function:
```typescript
const isNewPlaylist = playlist.title.includes('New Playlist');

if (isNewPlaylist) {
  videoContext = `
    For this specific "New Playlist", you MUST use the following videos...
    ${NEW_PLAYLIST_VIDEOS.map((v, i) => `${i + 1}. ${v.title}: ${v.url}`).join('\n')}
  `;
}
```

4. **Update condition** in the return statement to include new playlist

## Troubleshooting

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then reinstall

### API Key Issues
- Verify `.env` file has `VITE_GEMINI_API_KEY`
- Ensure environment variable is set in production platform
- Check API key is valid in Google AI Studio

### Missing Video URLs
- Unconfigured playlists will use Google Search (less reliable)
- Add hardcoded URLs following the steps above for better accuracy

## Monitoring & Maintenance

### Check Application Health
- Test each configured playlist monthly
- Verify all video links still work
- Monitor Gemini API usage

### Update Video Lists
- If Mental Dental uploads new videos, update the constants
- Rebuild and redeploy

## Support

For issues or questions:
1. Check the walkthrough.md artifact
2. Review implementation_plan.md
3. Test with a single playlist first
