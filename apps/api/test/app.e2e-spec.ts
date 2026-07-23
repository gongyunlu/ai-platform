import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { App } from 'supertest/types';
import request from 'supertest';
import { API_PREFIX } from '@ai-platform/shared';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(API_PREFIX.replace(/^\//, ''));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health 应返回 status=ok', async () => {
    const response = await request(app.getHttpServer() as App)
      .get(`${API_PREFIX}/health`)
      .expect(200);
    expect(response.body.status).toBe('ok');
    expect(typeof response.body.timestamp).toBe('string');
    expect(typeof response.body.uptime).toBe('number');
  });
});
