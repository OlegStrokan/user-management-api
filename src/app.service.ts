import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo(): string {
    return 'Hi this is test task api';
  }
}
