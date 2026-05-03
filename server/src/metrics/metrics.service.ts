import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Registry,
  Histogram,
  Counter,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly register: Registry;

  public httpRequestDuration: Histogram;
  public httpRequestsTotal: Counter;

  constructor() {
    this.register = new Registry();

    // Собираем стандартные метрики (память, CPU процесса и т.д.)
    collectDefaultMetrics({ register: this.register });

    // Создаём свои HTTP метрики
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });
  }

  // Метод для получения всех метрик в формате Prometheus
  async getMetrics(): Promise<string> {
    return await this.register.metrics();
  }
}
