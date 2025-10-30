import Bottleneck from 'bottleneck';

export class RateLimiterAdapter {
  private readonly steamLimiter = new Bottleneck({
    reservoir: 80,
    reservoirRefreshInterval: 60_000,
    reservoirRefreshAmount: 80,
    minTime: 100
  });

  private readonly psnLimiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 150
  });

  scheduleSteam<T>(task: () => Promise<T>): Promise<T> {
    return this.steamLimiter.schedule(task);
  }

  schedulePsn<T>(task: () => Promise<T>): Promise<T> {
    return this.psnLimiter.schedule(task);
  }
}
