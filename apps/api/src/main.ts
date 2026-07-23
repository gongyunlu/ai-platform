import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { API_PREFIX } from '@ai-platform/shared';
import { AppModule } from './app.module';

async function bootstrap() {
  // 开发/生产前端均通过 Next.js rewrites 反代 /api/*，浏览器与后端同源，不需要开 CORS。
  // 如需为外部调用方开放，请显式配置 origin 白名单而非 cors: true。
  const app = await NestFactory.create(AppModule);

  // 统一前缀 /api，与前端 Next.js rewrites 中的 /api/:path* 保持一致。
  app.setGlobalPrefix(API_PREFIX.replace(/^\//, ''));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number.parseInt(process.env.PORT ?? '3001', 10);
  await app.listen(port);

  Logger.log(`API is running on http://localhost:${port}${API_PREFIX}`, 'Bootstrap');
}

void bootstrap();
