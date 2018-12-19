import { LogLevelToBootstrapPipe } from './log-level-to-bootstrap.pipe';

describe('LogLevelToBootstrapPipe', () => {
  it('create an instance', () => {
    const pipe = new LogLevelToBootstrapPipe();
    expect(pipe).toBeTruthy();
  });
});
