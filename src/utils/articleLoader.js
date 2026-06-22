import articles from '../data/articles.js';

export function getRandomArticle() {
  const index = Math.floor(Math.random() * articles.length);
  return articles[index];
}

export function getArticleById(id) {
  return articles.find(a => a.id === id);
}

export function getAllArticles() {
  return [...articles];
}
