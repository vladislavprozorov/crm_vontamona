import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';
import { Request, Response } from 'express';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - start) / 1000;
        const statusCode = response.statusCode.toString();
        const routePath = originalUrl || 'unknown';

        // Увеличиваем счётчик запросов
        this.metricsService.httpRequestsTotal.inc({
          method,
          route: routePath,
          status_code: statusCode,
        });
        // Записываем длительность
        this.metricsService.httpRequestDuration.observe(
          { method, route: routePath, status_code: statusCode },
          duration,
        );
      }),
    );
  }
}
