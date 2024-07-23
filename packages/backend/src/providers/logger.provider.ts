import { LogLevel, LoggerService } from '@nestjs/common';

export class AppLogger implements LoggerService {
  private logLevel: LogLevel = 'debug';

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  log(message: string) {
    this.print(console.log, message);
  }

  error(message: string, trace: string) {
    this.print(console.error, message, trace);
  }

  warn(message: string) {
    this.print(console.warn, message);
  }

  debug(message: string) {
    if (this.logLevel === 'debug') {
      this.print(console.debug, message);
    }
  }

  verbose(message: string) {
    if (this.logLevel === 'debug') {
      this.print(console.debug, message);
    }
  }

  private print(method: CallableFunction, ...message: string[]) {
    const current = new Date();

    method(...[current, ...message]);
  }
}
