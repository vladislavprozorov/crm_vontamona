import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, lastValueFrom, of } from 'rxjs';
import { MetricsInterceptor } from './metrics.interceptor';
import { MetricsService } from './metrics.service';
import type { Request, Response } from 'express';

describe('MetricsInterceptor', () => {
  it('increments counters and observes duration', async () => {
    const incMock = jest.fn();
    const observeMock = jest.fn();

    const metricsService = {
      httpRequestsTotal: { inc: incMock },
      httpRequestDuration: { observe: observeMock },
    } as unknown as MetricsService;

    const interceptor = new MetricsInterceptor(metricsService);

    const req = {
      method: 'GET',
      originalUrl: '/clients',
    } as unknown as Request;
    const res = { statusCode: 200 } as unknown as Response;
    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: (): Observable<string> => of('ok'),
    };

    await lastValueFrom(interceptor.intercept(context, next));

    expect(incMock).toHaveBeenCalledWith({
      method: 'GET',
      route: '/clients',
      status_code: '200',
    });
    expect(observeMock).toHaveBeenCalled();
  });
});
