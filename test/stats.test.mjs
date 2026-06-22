import { describe, it, expect } from './runner.mjs';
import {
  calculateWPM,
  calculateAccuracy,
  calculateStats,
  formatTime,
} from '../src/utils/stats.js';

describe('calculateWPM', () => {
  it('正常 60 秒完成：250 字符 => 50 WPM', () => {
    expect(calculateWPM(250, 60)).toBe(50);
  });

  it('提前 30 秒打完：150 字符 => 60 WPM', () => {
    expect(calculateWPM(150, 30)).toBe(60);
  });

  it('0 秒边界：返回 0 不抛错', () => {
    expect(calculateWPM(100, 0)).toBe(0);
  });

  it('0 正确字符：返回 0', () => {
    expect(calculateWPM(0, 30)).toBe(0);
  });

  it('很短时间内打字：10 秒 50 字符 => 60 WPM', () => {
    expect(calculateWPM(50, 10)).toBe(60);
  });
});

describe('calculateAccuracy', () => {
  it('100% 全对：50 正确 / 50 输入 => 100', () => {
    expect(calculateAccuracy(50, 50)).toBe(100);
  });

  it('50% 对错：50 正确 / 100 输入 => 50', () => {
    expect(calculateAccuracy(50, 100)).toBe(50);
  });

  it('0 字符边界：默认 100%', () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it('全错：0 正确 / 30 输入 => 0', () => {
    expect(calculateAccuracy(0, 30)).toBe(0);
  });

  it('小数向下取整：33 正确 / 50 输入 => 66 (66%)', () => {
    expect(calculateAccuracy(33, 50)).toBe(66);
  });
});

describe('formatTime', () => {
  it('60 秒 => 1:00', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  it('30 秒 => 0:30', () => {
    expect(formatTime(30)).toBe('0:30');
  });

  it('0 秒 => 0:00', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('90 秒 => 1:30', () => {
    expect(formatTime(90)).toBe('1:30');
  });

  it('59.9 秒小数 floor => 0:59', () => {
    expect(formatTime(59.9)).toBe('0:59');
  });
});

describe('calculateStats（综合）', () => {
  it('完美完成所有字符', () => {
    const original = 'hello world';
    const input = 'hello world';
    const stats = calculateStats(original, input, 12);
    expect(stats.wpm).toBeGreaterThan(0);
    expect(stats.accuracy).toBe(100);
    expect(stats.correctChars).toBe(11);
    expect(stats.wrongChars).toBe(0);
    expect(stats.totalTyped).toBe(11);
  });

  it('有错误字符：正确字符算对，错误字符算错', () => {
    const original = 'hello';
    const input = 'h3ll0';
    const stats = calculateStats(original, input, 5);
    expect(stats.correctChars).toBe(3);
    expect(stats.wrongChars).toBe(2);
    expect(stats.accuracy).toBe(60);
  });

  it('输入超过原文长度：超出来的字符全算错', () => {
    const original = 'abc';
    const input = 'abcdef';
    const stats = calculateStats(original, input, 6);
    expect(stats.correctChars).toBe(3);
    expect(stats.wrongChars).toBe(3);
    expect(stats.totalTyped).toBe(6);
  });

  it('空输入：全 0 或初始态', () => {
    const stats = calculateStats('hello', '', 0);
    expect(stats.wpm).toBe(0);
    expect(stats.accuracy).toBe(100);
    expect(stats.correctChars).toBe(0);
    expect(stats.wrongChars).toBe(0);
  });
});
