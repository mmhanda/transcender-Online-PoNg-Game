import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  dotenv.config();
  // const config = new DocumentBuilder()
  //   .setTitle('NestJS API')
  //   .setDescription('NestJS API description')
  //   .setVersion('1.0')
  //   .addTag('nestjs')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  app.use(passport.initialize());
  await app.listen(process.env.PORT);
}
bootstrap();
