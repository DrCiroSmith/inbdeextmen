# INBDE Study Platform

An interactive study tool for the INBDE (Integrated National Board Dental Examination) built with React, TypeScript, and Google Gemini AI.

## Features

- 📚 **15 Mental Dental Playlists** covering all INBDE topics
- 🎯 **Independent Study Modules** for each video
- 📝 **AI-Generated Content**:
  - High-yield summaries
  - Flashcards
  - Multiple-choice questions
  - True/False statements
- 💾 **Export Functionality**:
  - Download individual video JSONs
  - Download all videos at once
  - Copy JSON to clipboard
- 🔗 **Direct Video Links** to Mental Dental YouTube videos

## Configured Playlists

Currently optimized with hardcoded video URLs (37 total videos):

✅ **Head & Neck Anatomy** (20 videos)  
✅ **Pharmacology** (10 videos)  
✅ **Oral Radiology** (7 videos)

*12 additional playlists available with AI-powered video discovery*

## Quick Start

### Prerequisites
- Node.js 18 or higher
- Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/inbdeextmen.git
cd inbdeextmen

# Install dependencies
npm install

# Create .env file
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env

# Start development server  
npm run dev
```

Visit `http://localhost:5173` to use the application.

## Usage

1. **Select a Playlist** from the homepage
2. **Generate Study Data** (requires Gemini API key)
3. **Review** the generated modules for each video
4. **Download** individual JSONs or all at once
5. **Study** using the comprehensive materials

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: CSS3 with modern design
- **AI**: Google Gemini 2.0 Flash Experimental
- **Build Tool**: Vite
- **Deployment**: GitHub Actions + GitHub Pages

## Project Structure

```
inbdeextmen/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API services (Gemini)
│   ├── types/           # TypeScript types
│   └── constants.ts     # Playlist definitions
├── .github/workflows/   # CI/CD workflows
├── DEPLOYMENT.md        # Deployment guide
└── README.md
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding New Playlists

See [DEPLOYMENT.md](DEPLOYMENT.md#adding-more-playlists) for detailed instructions on adding hardcoded video URLs for new playlists.

## Deployment

This project supports multiple deployment options:

- **GitHub Pages** (included workflow)
- **Vercel**
- **Netlify**

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

- [ ] Add remaining 12 playlists with hardcoded URLs
- [ ] Implement user authentication
- [ ] Add progress tracking
- [ ] Create mobile app version
- [ ] Add spaced repetition algorithm

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Mental Dental** by Dr. Ryan for the excellent INBDE content
- **Google Gemini** for AI-powered study material generation
- **Vite** and **React** teams for excellent developer tools

## Support

For issues or questions:
- Open an issue on GitHub
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting

---

Made with ❤️ for dental students preparing for the INBDE
