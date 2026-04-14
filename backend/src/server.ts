import app from './app.js';
import redis from './config/cache.js';
import env from './config/config.js';
import connectDB from './config/database.js';

const port = Number(env.PORT || '3000');

async function bootstrap() {
  try {
    await connectDB();
    await redis.ping();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Server bootstrap failed:', error);
    process.exit(1);
  }
}

void bootstrap();
