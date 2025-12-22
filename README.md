# INBDE Study Platform

A comprehensive study platform for the **Integrated National Board Dental Examination (INBDE)** built with React, TypeScript, and Google Gemini AI. Designed to replicate bootcamp-style INBDE preparation with AI-powered study material generation.

## 🎯 Platform Features

### Exam Information
- **Complete INBDE Overview**: Exam format, structure, scoring, and eligibility requirements
- **Content Domain Breakdown**: Foundation Knowledge and Patient Care Assessment domains with percentages
- **Recommended Study Schedule**: 5-phase study plan spanning 20-30 weeks
- **High-Yield Topics**: Critical concepts for each of the 15 subject areas
- **Exam Day Tips**: Actionable advice for test day success

### Study Materials
- 📚 **15 Mental Dental Playlists** covering all INBDE topics
- 🎯 **Independent Study Modules** for each video
- 📝 **AI-Generated Content**:
  - High-yield summaries
  - Flashcards (25 per video)
  - Multiple-choice questions with explanations
  - True/False statements
  - Fill-in-the-blank exercises
  - Matching exercises
  - Clinical scenario questions
- 💾 **Export Functionality**:
  - Download individual video JSONs
  - Copy JSON to clipboard
- 🔗 **Direct Video Links** to Mental Dental YouTube videos

## 📊 INBDE Exam Quick Facts

| Aspect | Details |
|--------|---------|
| Total Questions | 500 (400 scored, 100 pilot) |
| Test Days | 2 days |
| Sessions per Day | 4 sessions |
| Time per Session | 65 minutes |
| Passing Score | 75 |
| Score Range | 49-99 |
| Cost | $545 USD |

## 📚 Subject Coverage

### Foundation Knowledge (Biomedical Sciences)
- Anatomic Sciences (10-15%)
- Biochemistry and Physiology (8-12%)
- Microbiology and Immunology (8-12%)
- Pathology (10-15%)
- Dental Materials (5-10%)

### Patient Care Assessment (Clinical Sciences)
- Patient Assessment and Diagnosis (15-20%)
- Restorative and Prosthetic Dentistry (15-20%)
- Periodontics (10-15%)
- Endodontics (8-12%)
- Oral Surgery (8-12%)
- Orthodontics and Pediatric Dentistry (8-12%)
- Pharmacology (8-12%)
- Practice and Profession (5-10%)

## 🚀 Configured Playlists

All 15 playlists with complete video coverage:

| # | Subject | Videos |
|---|---------|--------|
| 1 | Head & Neck Anatomy | 20 |
| 2 | Pharmacology | 10 |
| 3 | Oral Medicine | 25 |
| 4 | Oral Radiology | 7 |
| 5 | Oral Pathology | 20 |
| 6 | Biostatistics | 5 |
| 7 | Orthodontics | 12 |
| 8 | Periodontics | 14 |
| 9 | Endodontics | 9 |
| 10 | Prosthodontics | 25 |
| 11 | Pediatric Dentistry | 10 |
| 12 | Oral Surgery | 11 |
| 13 | Operative Dentistry | 7 |
| 14 | Ethics | 8 |
| 15 | Patient Management | 11 |

## 🛠️ Quick Start

### Prerequisites
- Node.js 18 or higher
- Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

```bash
# Clone the repository
git clone https://github.com/DrCiroSmith/inbdeextmen.git
cd inbdeextmen

# Install dependencies
npm install

# Start development server  
npm run dev
```

Visit `http://localhost:5173` to use the application.

### Setting Up Your API Key

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/)
2. Click the ⚙️ Settings button in the app
3. Enter your API key (stored locally in your browser)

## 📖 Usage Guide

1. **Review Exam Info**: Click "📋 INBDE Info" to learn about the exam format, domains, and study schedule
2. **Select a Playlist**: Choose from 15 comprehensive subject areas
3. **Choose a Video**: Select specific videos to generate targeted study materials
4. **Study**: Use the interactive study mode with flashcards, quizzes, and clinical scenarios
5. **Export**: Download your study materials as JSON for offline use

## 🏗️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash
- **Build Tool**: Vite
- **Deployment**: GitHub Pages / Vercel / Netlify

## 📁 Project Structure

```
inbdeextmen/
├── App.tsx                # Main application component
├── constants.ts           # INBDE info, playlists, domains, study schedule
├── types.ts               # TypeScript type definitions
├── index.tsx              # Application entry point
├── index.html             # HTML template
├── components/
│   ├── ExamInfo.tsx       # Comprehensive INBDE exam information modal
│   ├── PlaylistCard.tsx   # Playlist selection cards
│   ├── VideoSelector.tsx  # Video selection interface
│   ├── StudyMode.tsx      # Interactive study mode
│   └── JsonViewer.tsx     # JSON data viewer and export
├── services/
│   ├── geminiService.ts   # Google Gemini AI integration
│   └── cacheService.ts    # Local storage caching
└── vite.config.ts         # Vite configuration
```

## 🎯 Study Features

### Flashcards
- 25 flashcards per video
- Flip animation for active recall
- Add custom flashcards

### Multiple Choice Questions
- Clinical scenario-based questions
- 4 options with detailed explanations
- Score tracking

### Fill-in-the-Blank
- Test specific terminology
- Reveal answer functionality
- Explanation for each answer

### Matching Exercises
- Drag-and-drop matching
- Visual feedback on correctness
- Reset and retry options

### Clinical Scenarios
- Real-world patient cases
- Treatment decision questions
- Detailed explanations

## 📈 Recommended Study Schedule

| Phase | Duration | Focus Areas |
|-------|----------|-------------|
| 1: Foundation | 4-6 weeks | Anatomy, Biochemistry, Microbiology |
| 2: Clinical Sciences | 6-8 weeks | Pharmacology, Pathology, Radiology, Medicine |
| 3: Clinical Disciplines | 6-8 weeks | Endo, Perio, Prostho, Operative |
| 4: Specialties | 4-6 weeks | Ortho, Pedo, Surgery, Ethics |
| 5: Integration | 2-4 weeks | Case integration, Practice exams |

## 🔒 Privacy

- Your API key is stored **locally** in your browser's localStorage
- No data is sent to external servers except Google Gemini API
- Study data is cached locally for faster access

## 📝 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📋 Roadmap

- [x] Complete INBDE exam information
- [x] All 15 playlists with videos
- [x] AI-powered study material generation
- [x] Interactive study modes
- [x] Local caching
- [ ] Spaced repetition algorithm
- [ ] Progress tracking
- [ ] Performance analytics
- [ ] Mobile app version

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Mental Dental** by Dr. Ryan for the excellent INBDE content
- **Google Gemini** for AI-powered study material generation
- **Vite** and **React** teams for excellent developer tools

## ⚠️ Disclaimer

This study platform is intended as a supplementary study aid. Always refer to official ADA/JCNDE guidelines and your dental school curriculum for the most accurate and up-to-date information about the INBDE.

---

Made with ❤️ for dental students preparing for the INBDE
