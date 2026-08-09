import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API endpoint to simulate emergency alert email dispatch
  app.post('/api/alert-email', (req, res) => {
    const { to, subject, details, photoUrl, latitude, longitude, address } = req.body;
    console.log(`[ALERT EMAIL SIMULATOR] Dispatching to ${to} | Subject: ${subject}`);
    res.json({
      success: true,
      message: `Emergency security alert email successfully dispatched to ${to}`,
      timestamp: new Date().toISOString(),
      mapLink: `https://maps.google.com/?q=${latitude},${longitude}`,
      sentDetails: { to, address, latitude, longitude }
    });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'CrookCatcher-Backend' });
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CrookCatcher app server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
