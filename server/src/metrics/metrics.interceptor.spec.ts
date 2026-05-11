import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { MetricsInterceptor } from './metrics.interceptor';
import { MetricsService } from './metrics.service';

describe('MetricsInterceptor', () => {
  it('increments counters and observes duration', (done) => {
    const metricsService = {
      httpRequestsTotal: { inc: jest.fn() },
      httpRequestDuration: { observe: jest.fn() },
    } as unknown as MetricsService;

    const interceptor = new MetricsInterceptor(metricsService);

    const req = { method: 'GET', originalUrl: '/clients' };
    const res = { statusCode: 200 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: () => of('ok'),
    };

    interceptor.intercept(context, next).subscribe({
      next: () => {
        expect(metricsService.httpRequestsTotal.inc).toHaveBeenCalledWith({
          method: 'GET',
          route: '/clients',
          status_code: '200',
        });
        expect(metricsService.httpRequestDuration.observe).toHaveBeenCalled();
      },
      complete: () => done(),
      error: done,
    });
  });
});
