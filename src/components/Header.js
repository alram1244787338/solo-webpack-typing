export function createHeader() {
  const header = document.createElement('header');
  header.className = 'header';

  const container = document.createElement('div');
  container.className = 'container';

  const logo = document.createElement('h1');
  logo.className = 'logo';
  logo.textContent = '打字竞速';

  const nav = document.createElement('nav');
  nav.className = 'nav';

  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.className = 'nav-link';
  homeLink.textContent = '首页';

  const rankLink = document.createElement('a');
  rankLink.href = '#';
  rankLink.className = 'nav-link';
  rankLink.textContent = '排行榜';

  nav.appendChild(homeLink);
  nav.appendChild(rankLink);
  container.appendChild(logo);
  container.appendChild(nav);
  header.appendChild(container);

  return header;
}

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  const container = document.createElement('div');
  container.className = 'container';

  const text = document.createElement('p');
  text.textContent = '\u00A9 2026 打字竞速';

  container.appendChild(text);
  footer.appendChild(container);

  return footer;
}
