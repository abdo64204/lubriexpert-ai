import { createApp } from './app';
import { env, validateEnvironment } from './config/environment';

const app = createApp();

validateEnvironment();

const host = process.env['HOST'] || '0.0.0.0';

const server = app.listen(env.port, host, () => {
  const line = '═'.repeat(44);
  console.log(`
╔${line}╗
║         LubriExpert AI — Backend Server        ║
╠${line}╣
║  Status:  🟢 Running                           ║
║  Host:    ${host.padEnd(33)}║
║  Port:    ${String(env.port).padEnd(33)}║
║  Env:     ${env.nodeEnv.padEnd(33)}║
║  AI:      ${env.aiProvider} / ${env.aiModel.padEnd(22 - env.aiProvider.length)}║
╚${line}╝
  `);

  if (env.nodeEnv === 'production') {
    console.log(`🌐 Server running on http://${host}:${env.port}`);
    console.log(`🌐 Health check: /api/health`);
  } else {
    console.log(`🌐 Local URL: http://localhost:${env.port}`);
    console.log(`🌐 Health:    http://localhost:${env.port}/api/health`);
  }
  console.log(`🔑 AI Key:   ${env.aiApiKey ? '✅ Configured' : '❌ NOT SET'}`);
});

// Graceful shutdown handling for container and cloud platforms
const handleShutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('Backend server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

