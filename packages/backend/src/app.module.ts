import * as passport from 'passport';
import * as session from 'express-session';

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/config.schema';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema,
    }),
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const sessionMiddleware = session({
      name: process.env.COOKIE_NAME!,
      secret: process.env.SESSION_SECRET_KEY!,
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      cookie: {
        sameSite: 'lax',
        maxAge: Number(process.env.SESSION_EXPIRES_IN) || 0, // cookie timeout
      },
    });

    const passportMiddleware = () => {
      return [passport.initialize(), passport.session()];
    };

    consumer
      .apply(sessionMiddleware, ...passportMiddleware(), LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
