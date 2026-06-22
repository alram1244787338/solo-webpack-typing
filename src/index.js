import './styles/global.css';
import './styles/layout.css';

const app = document.getElementById('app');

app.innerHTML = `
  <header class="header">
    <div class="container">
      <h1 class="logo">打字竞速</h1>
      <nav class="nav">
        <a href="#" class="nav-link">首页</a>
        <a href="#" class="nav-link">排行榜</a>
      </nav>
    </div>
  </header>

  <main class="main">
    <div class="container">
      <section class="placeholder">
        <h2>打字竞速 - 项目占位</h2>
        <p>随机文章打字测试 · 实时 WPM/准确率统计 · 计时模式 · 排行榜</p>
        <div class="placeholder-box">
          <span>功能开发中...</span>
        </div>
      </section>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 打字竞速</p>
    </div>
  </footer>
`;
