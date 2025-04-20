import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Entrypoint' })
  @ApiResponse({
    status: 200,
    description: 'The entrypoint route for my API',
  })
  getApiInfo(): string {
    return this.appService.getApiInfo();
  }
}
