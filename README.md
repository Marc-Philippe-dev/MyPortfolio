# MyPortfolio - Data Engineering Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS, showcasing data engineering and analytics projects.

## 🎨 Design System

### Color Palette
- **Background**: `#0a192f` (Deep Navy) - main background
- **Surface**: `#112240` (Slate Blue) - cards, sections
- **Primary Accent**: `#64ffda` (Mint/Cyan) - CTAs, links, highlights
- **Secondary Accent**: `#f57c00` (Data Orange) - important metrics, badges
- **Heading Text**: `#ccd6f6` (Light Slate)
- **Body Text**: `#8892b0` (Muted Slate)
- **Highlight**: `#ffffff` (White) - important text

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
MyPortfolio/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx        # Navigation component
│   ├── Footer.tsx        # Footer component
│   └── ProjectCard.tsx   # Project card component
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## 📝 Customization

### Adding Projects
Edit the `projects` array in `app/page.tsx` to add your own projects.

### Updating Skills
Modify the `dataSkills` and `tools` arrays in `app/about/page.tsx`.

### Changing Colors
Update the color values in `tailwind.config.js` to match your brand.

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

## 📄 License

This project is private and proprietary.
