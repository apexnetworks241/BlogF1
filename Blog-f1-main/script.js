// Dados de pilotos por equipe (2025)
const driversByTeam = {
    "Red Bull Racing": ["Max Verstappen", "Yuki Tsunoda"],
    "Ferrari": ["Charles Leclerc", ""],
    "Mercedes": ["Lewis Hamilton", "George Russell"],
    "McLaren": ["Lando Norris", "Oscar Piastri"],
    "Aston Martin": ["Fernando Alonso", "Lance Stroll"],
    "Alpine": ["Pierre Gasly", "Franco Colapinto"],
    "Williams": ["Alexander Albon", "Carlos Sainz"],
    "Haas": ["Nico Hülkenberg", "Oliver Bearman"],
    "RB": ["Daniel Ricciardo", "Yuki Tsunoda"],
    "Kick Sauber": ["Gabriel Bortoleto", "Nico Hülkenberg"]
  };
  
  // Elementos
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const teamSelect = document.getElementById('team');
  const driversSelect = document.getElementById('drivers');
  const newsForm = document.getElementById('news-form');
  const newsCards = document.getElementById('news-cards');
  const manageList = document.getElementById('manage-list');
  const searchInput = document.getElementById('search-input');
  
  // Função para normalizar texto (remover acentos e deixar minúsculo)
  function normalizeText(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  
  // Toggle menu hambúrguer
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  // Fechar menu ao clicar em link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
  });
  
  // Atualizar pilotos ao mudar equipe
  teamSelect.addEventListener('change', () => {
    driversSelect.innerHTML = '';
    const team = teamSelect.value;
    if (team && driversByTeam[team]) {
      driversByTeam[team].forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        driversSelect.appendChild(opt);
      });
    }
  });
  
  // Adicionar notícia
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const team = teamSelect.value;
    const drivers = Array.from(driversSelect.selectedOptions).map(o => o.value);
  
    if (drivers.length > 2) {
      alert('Máximo de 2 pilotos permitidos.');
      return;
    }
  
    const news = {
      id: Date.now(),
      title,
      content,
      team,
      drivers,
      date: new Date().toLocaleDateString('pt-BR')
    };
  
    const all = JSON.parse(localStorage.getItem('f1News')) || [];
    all.unshift(news);
    localStorage.setItem('f1News', JSON.stringify(all));
  
    renderNews();
    renderManageNews();
    newsForm.reset();
    driversSelect.innerHTML = '';
  });
  
  // Busca em tempo real (com normalização)
  searchInput.addEventListener('input', renderNews);
  
  // Renderizar cards de notícias com busca inteligente
  function renderNews() {
    const all = JSON.parse(localStorage.getItem('f1News')) || [];
    const searchTerm = normalizeText(searchInput.value.trim());
  
    const filtered = all.filter(news => {
      if (!searchTerm) return true;
  
      const title = normalizeText(news.title);
      const content = normalizeText(news.content);
      const team = normalizeText(news.team);
      const drivers = news.drivers.map(d => normalizeText(d)).join(' ');
  
      return title.includes(searchTerm) ||
             content.includes(searchTerm) ||
             team.includes(searchTerm) ||
             drivers.includes(searchTerm);
    });
  
    newsCards.innerHTML = filtered.length
      ? ''
      : '<p style="grid-column:1/-1; text-align:center;">Nenhuma notícia encontrada.</p>';
  
    filtered.forEach(news => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-content">
          <h3>${news.title}</h3>
          <div class="card-meta">
            <strong>${news.team}</strong> • ${news.drivers.join(', ')} • ${news.date}
          </div>
          <p>${news.content.substring(0, 120)}${news.content.length > 120 ? '...' : ''}</p>
        </div>
      `;
      newsCards.appendChild(card);
    });
  }
  
  // Renderizar lista de gerenciamento (SEM filtro de busca)
  function renderManageNews() {
    const all = JSON.parse(localStorage.getItem('f1News')) || [];
    manageList.innerHTML = '';
  
    if (all.length === 0) {
      manageList.innerHTML = '<p style="text-align:center;">Nenhuma notícia para gerenciar.</p>';
      return;
    }
  
    all.forEach(news => {
      const item = document.createElement('div');
      item.className = 'manage-item';
      item.innerHTML = `
        <div class="manage-item-info">
          <h3>${news.title}</h3>
          <div class="manage-item-meta">
            <strong>${news.team}</strong> • ${news.drivers.join(', ')} • ${news.date}
          </div>
          <div class="manage-item-content">${news.content}</div>
        </div>
        <button class="delete-btn" data-id="${news.id}">Excluir</button>
      `;
      manageList.appendChild(item);
    });
  
    // Evento de exclusão
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        if (confirm('Tem certeza que deseja excluir esta notícia?')) {
          deleteNews(id);
        }
      });
    });
  }
  
  // Excluir notícia
  function deleteNews(id) {
    let all = JSON.parse(localStorage.getItem('f1News')) || [];
    all = all.filter(n => n.id !== id);
    localStorage.setItem('f1News', JSON.stringify(all));
    renderNews();
    renderManageNews();
  }
  
  // Slider automático
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  
  document.getElementById('next-slide').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  });
  
  document.getElementById('prev-slide').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  });
  
  // Inicializar tudo
  document.addEventListener('DOMContentLoaded', () => {
    renderNews();
    renderManageNews();
    // Slider automático a cada 5 segundos
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }, 5000);
  });