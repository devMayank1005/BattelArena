import app from './app.js';
import redis from './config/cache.js';
import env, { getMissingRequiredEnv } from './config/config.js';
import connectDB from './config/database.js';
const port = Number(env.PORT || '3000');
async function bootstrap() {
    try {
        const missingEnv = getMissingRequiredEnv();
        if (missingEnv.length > 0) {
            throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
        }
        await connectDB();
        try {
            await redis.ping();
        }
        catch (redisError) {
            console.warn('Redis unavailable at startup; continuing without cache.', redisError);
        }
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Server bootstrap failed:', error);
        process.exit(1);
    }
}
void bootstrap();
