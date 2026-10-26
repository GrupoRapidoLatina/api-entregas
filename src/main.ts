import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/http/filters/http-exception.filter';
import { RequestLoggingInterceptor } from './core/http/interceptors/request-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.use(json({ limit: '25mb' }));
  app.use(urlencoded({ extended: true, limit: '25mb' }));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor());
  app.setGlobalPrefix('ApiController', {
    exclude: ['health', 'health/{*path}', 'docs', 'docs/{*path}'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Rápido Entregas API')
    .setDescription(
      'Rotas do app. As protegidas pedem o header Authorization: Bearer com o token devolvido no login. Erros saem como { success: false, message }.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    { swaggerOptions: { persistAuthorization: true } },
  );

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  console.log(`Rapido Entregas API listening on :${port}`);
}
bootstrap();
