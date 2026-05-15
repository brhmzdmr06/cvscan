// api/analyze.js — Vercel Serverless Function
// Place this file at: /api/analyze.js in your project root

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Missing content' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,  // Set this in Vercel dashboard
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25'  // Required for PDF support
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2000,
        system: system,
        messages: [
          {
            role: 'user',
            content: content
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Anthropic API error:', errData);
      return res.status(500).json({ error: 'Analysis service error. Please try again.' });
    }

    const data = await response.json();
    const text = data.content[0].text;

    // Parse JSON from Claude's response
    let parsed;
    try {
      // Strip any markdown code fences just in case
      const clean = text.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error('JSON parse error:', e, 'Raw text:', text);
      return res.status(500).json({ error: 'Failed to parse analysis. Please try again.' });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
