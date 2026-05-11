declare module 'prom-client' {
  export class Registry {
    metrics(): string;
  }

  export type MetricConfiguration<TLabelNames extends string> = {
    name: string;
    help: string;
    labelNames?: TLabelNames[];
    registers?: Registry[];
  };

  export class Histogram<
    TLabels extends Record<string, string> = Record<string, string>,
  > {
    constructor(config: MetricConfiguration<keyof TLabels & string>);
    observe(labels: TLabels, value: number): void;
  }

  export class Counter<
    TLabels extends Record<string, string> = Record<string, string>,
  > {
    constructor(config: MetricConfiguration<keyof TLabels & string>);
    inc(labels: TLabels, value?: number): void;
  }

  export function collectDefaultMetrics(opts: { register: Registry }): void;
}
