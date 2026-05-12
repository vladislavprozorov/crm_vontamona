import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  it('returns metrics text', async () => {
    const service = new MetricsService();
    const result = service.getMetrics();

    const metrics =
      typeof (result as unknown as Promise<unknown>)?.then === 'function'
        ? await (result as unknown as Promise<string>)
        : result;

    expect(typeof metrics).toBe('string');
    expect(metrics.length).toBeGreaterThan(0);
  });
});
