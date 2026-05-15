# CVScan.ai — Setup Guide

## Files
```
/index.html        → Landing page
/upload.html       → CV upload + analysis page
/api/analyze.js    → Vercel serverless function (keeps API key safe)
/vercel.json       → Vercel routing config
```

## Deploy Steps

### 1. GitHub
- Create a new repo on GitHub
- Upload all these files
- Keep the folder structure exactly as is

### 2. Vercel
- Go to vercel.com → New Project → Import your GitHub repo
- Deploy (takes 1 minute)

### 3. Add API Key (CRITICAL)
- In Vercel dashboard → Your project → Settings → Environment Variables
- Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
- Redeploy

### 4. Stripe Payment Link
- Go to dashboard.stripe.com
- Products → Create Product → "CV Analysis" → $4.99 → One time
- Create a Payment Link
- After payment, set redirect URL to: https://yoursite.vercel.app/upload.html
- Replace the "Analyze My CV — $4.99" button href in index.html with your Stripe link

### 5. Custom Domain (optional)
- Buy domain (e.g. cvscan.ai or similar)
- In Vercel → Domains → Add your domain

## That's it. You're live.

## Future: Stripe Webhook (prevent unpaid access)
Currently upload.html is accessible without payment.
To lock it properly, add a Stripe webhook that generates a one-time token
and pass it as a URL parameter after payment. Let me know when ready.

## Environment Variables needed
- `ANTHROPIC_API_KEY` — from console.anthropic.com
