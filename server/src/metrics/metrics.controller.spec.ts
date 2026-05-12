import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import type { Response } from 'express';

describe('MetricsController', () => {
  it('sets content-type and sends metrics', () => {
    const service: Pick<MetricsService, 'getMetrics'> = {
      getMetrics: () => 'my_metrics',
    };

    const controller = new MetricsController(service as MetricsService);

    const setMock = jest.fn() as unknown as Response['set'];
    const sendMock = jest.fn() as unknown as Response['send'];

    const res = {
      set: setMock,
      send: sendMock,
    } as unknown as Response;

    controller.getMetrics(res);

    expect(setMock).toHaveBeenCalledWith(
      'Content-Type',
      'text/plain; version=0.0.4',
    );
    expect(sendMock).toHaveBeenCalledWith('my_metrics');
  });
});
