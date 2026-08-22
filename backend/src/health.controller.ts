import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  health(): Record<string, string> {
    return { status: 'ok' };
  }
}
