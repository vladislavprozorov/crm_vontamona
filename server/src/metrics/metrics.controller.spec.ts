import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  it('sets content-type and sends metrics', () => {
    const service: Pick<MetricsService, 'getMetrics'> = {
      getMetrics: () => 'my_metrics',
    };

    const controller = new MetricsController(service as MetricsService);

    const res = {
      set: jest.fn(),
      send: jest.fn(),
    } as unknown as any;

    controller.getMetrics(res);

    expect(res.set).toHaveBeenCalledWith(
      'Content-Type',
      'text/plain; version=0.0.4',
    );
    expect(res.send).toHaveBeenCalledWith('my_metrics');
  });
});
