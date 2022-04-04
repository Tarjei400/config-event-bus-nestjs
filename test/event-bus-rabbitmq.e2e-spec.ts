import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
const { GenericContainer } = require("testcontainers");

describe('EventBus RabbitMQ Driver (e2e)', () => {
  let app: INestApplication;
  let container;

  beforeAll(async () => {
    container = await new GenericContainer("bitnami/rabbitmq:3.9")
      .withExposedPorts(5672)
      .withEnv('RABBITMQ_SECURE_PASSWORD', true)
      .start();

  });

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
