import { describe, it, expect } from './runner.mjs';
import {
  getRandomArticle,
  getArticleById,
  getAllArticles,
} from '../src/utils/articleLoader.js';
import articles from '../src/data/articles.js';

describe('getAllArticles', () => {
  it('返回的文章数和原始数据一致', () => {
    const all = getAllArticles();
    expect(all).toHaveLength(articles.length);
  });

  it('返回的是独立拷贝，不影响原数据', () => {
    const all = getAllArticles();
    all.push({ id: 999, title: 'x', content: 'x' });
    expect(getAllArticles()).toHaveLength(articles.length);
  });

  it('每篇文章都有 id/title/content 字段', () => {
    const all = getAllArticles();
    for (const a of all) {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('title');
      expect(a).toHaveProperty('content');
      expect(typeof a.content).toBe('string');
      expect(a.content.length).toBeGreaterThan(0);
    }
  });
});

describe('getRandomArticle', () => {
  it('返回有效文章对象', () => {
    const a = getRandomArticle();
    expect(a).toBeDefined();
    expect(a).toHaveProperty('id');
    expect(a).toHaveProperty('title');
    expect(a).toHaveProperty('content');
  });

  it('返回的文章属于 articles 数组', () => {
    const a = getRandomArticle();
    const ids = articles.map((x) => x.id);
    expect(ids).toContain(a.id);
  });

  it('多次调用可能返回不同文章（随机性检查）', () => {
    const results = new Set();
    for (let i = 0; i < 20; i++) {
      results.add(getRandomArticle().id);
    }
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('getArticleById', () => {
  it('存在的 id 返回对应文章', () => {
    const a = getArticleById(1);
    expect(a).toBeDefined();
    expect(a.id).toBe(1);
    expect(typeof a.title).toBe('string');
  });

  it('不存在的 id 返回 undefined', () => {
    expect(getArticleById(999)).toBeUndefined();
  });

  it('负数 id 返回 undefined', () => {
    expect(getArticleById(-1)).toBeUndefined();
  });

  it('0 id 返回 undefined', () => {
    expect(getArticleById(0)).toBeUndefined();
  });

  it('所有预置文章 id 都能查到', () => {
    for (const a of articles) {
      const found = getArticleById(a.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(a.id);
    }
  });
});
