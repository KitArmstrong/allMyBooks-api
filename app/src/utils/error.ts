import { HttpException } from '@nestjs/common';

export const handleError = (message: string, status: number) => {
  throw new HttpException(message, status);
};
