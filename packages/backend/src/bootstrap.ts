import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { RUN_MODE } from '@shared';
import { VersioningType } from '@nestjs/common';
import { AppLogger } from './providers/logger.provider';
import { GlobalExceptionFilter } from './providers/filters/global-exception.filter';

async function bootstrap() {
  const port = process.env.PORT || 8080;

  const isLocalMode = process.env.RUN_MODE === RUN_MODE.local;

  const logger = new AppLogger();
  logger.setLogLevel(isLocalMode ? 'debug' : 'warn');

  const app = await NestFactory.create(AppModule, {
    logger,
    bufferLogs: !isLocalMode,
  });

  // cors
  app.enableCors({});

  // exception handling
  app.useGlobalFilters(new GlobalExceptionFilter());

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: '',
  });

  await app.listen(port);
}

bootstrap();
