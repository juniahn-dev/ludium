import * as dayjs from 'dayjs';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { isEmpty, omit } from 'ramda';

import { Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('LoggerMiddleware');

  //   constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, baseUrl, headers, query } = req;

    const userAgent = req.get('user-agent') || '-';
    const startTime = dayjs();

    res.on('finish', async () => {
      const endTime = dayjs();

      const { statusCode, statusMessage } = res;
      console.log('!!!!', statusCode, statusMessage);

      const authorization = headers.authorization;
      const referer = headers.referer;
      const xForwardedFor = headers['x-forwarded-for'];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, token] = authorization ? authorization.split(' ') : ['-', '-'];

      const queryString = isEmpty(query)
        ? '-'
        : JSON.stringify(omit(['password'], query));
      const responseTime = endTime.diff(startTime, 'milliseconds');

      this.logger.log(
        `${ip} - ${token} [${endTime.toISOString()}] "${method} ${
          baseUrl || originalUrl
        } HTTP/1.1" ${statusCode} ${responseTime} ${referer || '-'} "${userAgent}" "${
          xForwardedFor || '-'
        }" "${queryString}" ${statusMessage}`,
      );

      if (token && token !== 'null') {
        // Token 들의 로그 및 호출 횟수 기록 로직
        console.log(token);
        // const context = req.context;

        // const is5xxError = statusCode >= 500 && statusCode <= 599;
        // const isNotAcceptable = statusCode === HttpStatus.NOT_ACCEPTABLE;

        // const usedCredits =
        //   is5xxError || isNotAcceptable ? 0 : Number(context?.credits || 3);
        // const moduleType = context?.moduleType || ModuleTypes.NONE;

        // const existToken =
        //   await this.loggerService.getAccessTokenByToken(token);

        // if (existToken) {
        //   const writeHistoryPromise = this.loggerService.writeTokenHistory({
        //     userId: existToken.userId,
        //     accessTokenId: Number(existToken.id),
        //     url: originalUrl,
        //     method,
        //     statusCode: String(statusCode),
        //     query: queryString,
        //     credits: usedCredits,
        //     responseTime,
        //     moduleType,
        //   });

        //   const updateStatsPromise = this.loggerService.updateTokenStats(
        //     existToken,
        //     statusCode,
        //     usedCredits,
        //   );

        //   const updateUserTokenStatisticsPromise =
        //     this.loggerService.updateUserTokenStatistics(
        //       existToken,
        //       usedCredits,
        //     );

        //   await writeHistoryPromise;
        //   await updateStatsPromise;
        //   await updateUserTokenStatisticsPromise;
        // }
      }
    });

    next();
  }
}
