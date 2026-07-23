import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { API_PREFIX } from "@ai-platform/shared";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // 统一前缀 /api，与前端 Next.js rewrites 中的 /api/:path* 保持一致。
  app.setGlobalPrefix(API_PREFIX.replace(/^\//, ""));

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const port = Number.parseInt(process.env.PORT ?? "3001", 10);
  await app.listen(port);

  Logger.log(`API is running on http://localhost:${port}${API_PREFIX}`, "Bootstrap");
}

void bootstrap();
