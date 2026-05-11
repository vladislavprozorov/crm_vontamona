import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Registry,
  Histogram,
  Counter,
} from 'prom-client';

type HttpLabels = {
  method: string;
  route: string;
  status_code: string;
};

@Injectable()
export class MetricsService {
  private readonly register: Registry;

  public httpRequestDuration: Histogram<HttpLabels>;
  public httpRequestsTotal: Counter<HttpLabels>;

  constructor() {
    this.register = new Registry();

    // Собираем стандартные метрики (память, CPU процесса и т.д.)
    collectDefaultMetrics({ register: this.register });

    // Создаём свои HTTP метрики
    this.httpRequestDuration = new Histogram<HttpLabels>({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpRequestsTotal = new Counter<HttpLabels>({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });
  }

  // Метод для получения всех метрик в формате Prometheus
  getMetrics(): string {
    return this.register.metrics();
  }
}
