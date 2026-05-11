import { Controller, Get, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Response } from 'express';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  getMetrics(@Res() res: Response): void {
    const metrics = this.metricsService.getMetrics();
    res.set('Content-Type', 'text/plain; version=0.0.4');
    res.send(metrics);
  }
}
