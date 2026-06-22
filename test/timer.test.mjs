import { describe, it, expect } from './runner.mjs';
import { Timer } from '../src/utils/timer.js';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('Timer - 构造与初始状态', () => {
  it('默认 duration 为 60 秒', () => {
    const t = new Timer();
    expect(t.getRemaining()).toBe(60);
    expect(t.getElapsed()).toBe(0);
    expect(t.isRunning).toBe(false);
  });

  it('自定义 duration', () => {
    const t = new Timer(30);
    expect(t.getRemaining()).toBe(30);
  });

  it('duration 为 0 也能构造', () => {
    const t = new Timer(0);
    expect(t.getRemaining()).toBe(0);
  });
});

describe('Timer - 重置', () => {
  it('reset 后回到初始状态', () => {
    const t = new Timer(60);
    t.elapsedTime = 30;
    t.remaining = 30;
    t.reset();
    expect(t.getElapsed()).toBe(0);
    expect(t.getRemaining()).toBe(60);
    expect(t.isRunning).toBe(false);
  });

  it('setDuration 修改时长', () => {
    const t = new Timer(60);
    t.setDuration(120);
    expect(t.getRemaining()).toBe(120);
  });
});

describe('Timer - 运行计时 (真实时间)', () => {
  it('start 后约 100ms，elapsed >= 0.1', async () => {
    const t = new Timer(60);
    t.start();
    await sleep(120);
    const elapsed = t.getElapsed();
    t.stop();
    expect(elapsed).toBeGreaterThanOrEqual(0.1);
    expect(elapsed).toBeLessThan(0.5);
  });

  it('start 后约 100ms，remaining <= 59.9', async () => {
    const t = new Timer(60);
    t.start();
    await sleep(120);
    const remaining = t.getRemaining();
    t.stop();
    expect(remaining).toBeLessThanOrEqual(59.9);
    expect(remaining).toBeGreaterThan(59);
  });

  it('stop 后 elapsed 不再增长', async () => {
    const t = new Timer(60);
    t.start();
    await sleep(100);
    t.stop();
    const e1 = t.getElapsed();
    await sleep(100);
    const e2 = t.getElapsed();
    expect(e2).toBe(e1);
  });

  it('isRunning 在 start/stop 后正确', () => {
    const t = new Timer(60);
    expect(t.isRunning).toBe(false);
    t.start();
    expect(t.isRunning).toBe(true);
    t.stop();
    expect(t.isRunning).toBe(false);
  });

  it('重复 start 不会叠加 interval', async () => {
    const t = new Timer(60);
    let tickCount = 0;
    t.onTick = () => tickCount++;
    t.start();
    t.start();
    t.start();
    await sleep(250);
    t.stop();
    expect(tickCount).toBeLessThanOrEqual(5);
  });
});

describe('Timer - 回调机制', () => {
  it('onTick 会收到 remaining 和 elapsed', async () => {
    const t = new Timer(60);
    const calls = [];
    t.onTick = (remaining, elapsed) => {
      calls.push({ remaining, elapsed });
    };
    t.start();
    await sleep(150);
    t.stop();
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0].remaining).toBeLessThanOrEqual(60);
    expect(calls[0].elapsed).toBeGreaterThanOrEqual(0);
  });

  it('onComplete 在 duration 耗尽时触发', async () => {
    const t = new Timer(0.15);
    let completed = false;
    t.onComplete = () => {
      completed = true;
    };
    t.start();
    await sleep(300);
    expect(completed).toBe(true);
    expect(t.isRunning).toBe(false);
    expect(t.getRemaining()).toBe(0);
  });

  it('short duration：50ms 计时器在 100ms 内已完成', async () => {
    const t = new Timer(0.05);
    let completed = false;
    t.onComplete = () => (completed = true);
    t.start();
    await sleep(150);
    expect(completed).toBe(true);
    expect(t.isRunning).toBe(false);
  });
});

describe('Timer - 基于 Date.now 的时间一致性', () => {
  it('暂停后再继续，已用时间延续而非重置', async () => {
    const t = new Timer(60);
    t.start();
    await sleep(100);
    t.stop();
    const e1 = t.getElapsed();
    await sleep(100);
    t.start();
    await sleep(100);
    t.stop();
    const e2 = t.getElapsed();
    expect(e2).toBeGreaterThanOrEqual(e1 + 0.1);
    expect(e2).toBeLessThan(e1 + 0.35);
  });

  it('startTime 在 reset 后被清空', () => {
    const t = new Timer(60);
    t.start();
    expect(t.startTime === null).toBe(false);
    t.reset();
    expect(t.startTime).toBe(null);
  });
});
