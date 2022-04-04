import { HttpException, HttpStatus } from '@nestjs/common';

export class ConfigParseException extends HttpException {
  private cause: Error;

  constructor(cause?: Error) {
    super('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    this.cause = cause;
  }
}
