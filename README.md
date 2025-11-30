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
- Resend account (for newsletter functionality) - [Sign up here](https://resend.com)
- Vercel account (for KV database) - [Sign up here](https://vercel.com)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Resend API key:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=your-verified-email@yourdomain.com
   NEWSLETTER_EMAIL=your-email@example.com  # Optional: where to receive notifications
   RESEND_AUDIENCE_ID=your_audience_id  # Optional: Resend Contacts audience ID
   ```
   - Get your API key from [Resend Dashboard](https://resend.com/api-keys)
   - Verify your domain in Resend (or use `onboarding@resend.dev` for testing)
   - **For Contacts API**: Create an audience in [Resend Contacts](https://resend.com/audiences) and add the audience ID to `RESEND_AUDIENCE_ID`
   
3. Set up Vercel KV (for subscriber storage):
   - **For local development**: The app will use in-memory storage (data is lost on restart). This is fine for testing.
   - **For production (Vercel)**:
     1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
     2. Select your project
     3. Go to Storage → Create Database → KV
     4. Create a new KV database
     5. Vercel will automatically add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your environment variables
   - **For production (other platforms)**: You'll need to set these manually:
     ```env
     KV_REST_API_URL=https://your-kv-instance.upstash.io
     KV_REST_API_TOKEN=your_kv_token_here
     ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

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
│   ├── api/               # API routes
│   │   └── newsletter/    # Newsletter endpoints
│   │       ├── route.ts  # Subscription endpoint
│   │       ├── confirm/  # Confirmation endpoint
│   │       └── unsubscribe/ # Unsubscribe endpoint
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx        # Navigation component
│   ├── Footer.tsx        # Footer component
│   ├── ProjectCard.tsx   # Project card component
│   └── Newsletter.tsx    # Newsletter subscription component
├── data/                  # Centralized data files
│   ├── personal.json     # Personal information
│   ├── social.json       # Social media links
│   ├── projects.json     # Portfolio projects
│   ├── skills.json       # Skills and tools
│   ├── services.json     # Services offered
│   ├── faqs.json         # FAQ structure
│   └── newsletter.json   # Newsletter configuration
├── locales/              # Translation files
│   ├── en.json           # English translations
│   └── fr.json           # French translations
├── lib/                   # Utility functions
│   ├── portfolioData.ts  # Data exports
│   ├── tokens.ts         # Token generation utilities
│   └── subscribers.ts    # Subscriber management
├── contexts/              # React contexts
│   └── I18nContext.tsx  # Internationalization context
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Email Service**: Resend (for newsletter)
- **Database**: Vercel KV (Redis) for subscriber storage
- **Internationalization**: Custom i18n with English & French support
- **Deployment**: Vercel (recommended)

## 📝 Customization

### Managing Data
All portfolio data is centralized in the `data/` folder for easy management:

- **Personal Info**: Edit `data/personal.json` (name, email, phone, location)
- **Social Links**: Edit `data/social.json` (social media URLs)
- **Projects**: Edit `data/projects.json` (portfolio projects)
- **Skills**: Edit `data/skills.json` (technical skills and tools)
- **Services**: Edit `data/services.json` (services offered)
- **FAQs**: Edit `data/faqs.json` (FAQ structure)
- **Newsletter**: Edit `data/newsletter.json` (enable/disable newsletter)

### Adding Projects
1. Add project entry to `data/projects.json` with an `id`
2. Add translations to `locales/en.json` and `locales/fr.json` under `projects.{id}.title` and `projects.{id}.description`

### Updating Skills
Edit `data/skills.json` to add or modify skills and tools.

### Changing Colors
Update the color values in `tailwind.config.js` to match your brand.

### Newsletter Configuration

The newsletter uses a **single opt-in flow** for a simplified user experience:

1. **User subscribes**: User enters email and clicks "Subscribe"
2. **Immediate subscription**: User is immediately subscribed (status: confirmed)
3. **Welcome email sent**: System sends a welcome email and adds subscriber to Resend Contacts (if configured)
4. **Unsubscribe**: Each email includes an unsubscribe link with confirmation page

**Configuration:**
- Enable/disable: Set `"enabled": true/false` in `data/newsletter.json`
- Customize text: Update translations in `locales/en.json` and `locales/fr.json` under `newsletter`
- API Setup: Configure `RESEND_API_KEY` in `.env.local` (see Getting Started section)
- Base URL: Set `NEXT_PUBLIC_BASE_URL` in production (or `VERCEL_URL` is auto-detected)

**Subscriber Storage:**
- Subscribers are stored in **Vercel KV** (Redis database)
- In local development, the app uses in-memory storage (data is lost on restart)
- In production on Vercel, KV is automatically configured
- For other platforms, you'll need to set up a Redis-compatible database and configure `KV_REST_API_URL` and `KV_REST_API_TOKEN`

### Troubleshooting Newsletter

**If you're not receiving welcome emails:**

1. **Check your environment variables:**
   ```bash
   # Verify these are set in .env.local
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=your-email@yourdomain.com
   ```

2. **Test Resend configuration:**
   - Visit: `http://localhost:3000/api/newsletter/test?email=your-email@example.com`
   - This will send a test email and show any configuration errors

3. **Check the console logs:**
   - Server logs will show detailed error messages
   - Look for "Error sending welcome email" in your terminal

4. **Common issues:**
   - **Invalid API key**: Make sure your `RESEND_API_KEY` starts with `re_`
   - **Unverified email**: If using a custom domain, verify it in Resend dashboard
   - **Rate limits**: Free tier has limits (check Resend dashboard)
   - **Spam folder**: Check your spam/junk folder
   - **Email format**: Ensure `RESEND_FROM_EMAIL`` is a valid email address

5. **Verify in Resend Dashboard:**
   - Go to [Resend Dashboard](https://resend.com/emails)
   - Check the "Emails" section to see if emails were sent
   - Check for any error messages or delivery failures

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `RESEND_API_KEY` - Your Resend API key
   - `RESEND_FROM_EMAIL` - Your verified email address
   - `NEWSLETTER_EMAIL` - (Optional) Email to receive notifications
   - `RESEND_AUDIENCE_ID` - (Optional) Resend Contacts audience ID for storing subscribers
4. Vercel will automatically detect Next.js and deploy

### Environment Variables for Production
Make sure to add all required environment variables in your deployment platform:
- `RESEND_API_KEY` - Required for newsletter functionality
- `RESEND_FROM_EMAIL` - Required for sending emails
- `NEWSLETTER_EMAIL` - Optional, defaults to `RESEND_FROM_EMAIL`
- `RESEND_AUDIENCE_ID` - Optional, Resend Contacts audience ID
- `NEXT_PUBLIC_BASE_URL` - Optional, your production URL (auto-detected on Vercel)

## 📄 License

This project is private and proprietary.
