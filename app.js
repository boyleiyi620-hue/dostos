// DostOS - Arkadaş grubu yönetim uygulaması
// Kimi butonu YOK - tüm öneriler tüm arkadaşlara gider

const App = {
  state: {
    currentView: 'home',
    friends: JSON.parse(localStorage.getItem('dostos_friends') || '[]'),
    groups: JSON.parse(localStorage.getItem('dostos_groups') || '[]'),
    plans: JSON.parse(localStorage.getItem('dostos_plans') || '[]'),
    notifications: JSON.parse(localStorage.getItem('dostos_notifications') || '[]'),
    suggestions: JSON.parse(localStorage.getItem('dostos_suggestions') || '[]'),
  },

  save() {
    localStorage.setItem('dostos_friends', JSON.stringify(this.state.friends));
    localStorage.setItem('dostos_groups', JSON.stringify(this.state.groups));
    localStorage.setItem('dostos_plans', JSON.stringify(this.state.plans));
    localStorage.setItem('dostos_notifications', JSON.stringify(this.state.notifications));
    localStorage.setItem('dostos_suggestions', JSON.stringify(this.state.suggestions));
  },

  // Tüm arkadaşlara bildirim/öneri gönder
  notifyAllFriends(type, content, fromName = 'Sen') {
    const now = new Date();
    const timeStr = now.toLocaleString('tr-TR');
    this.state.friends.forEach(friend => {
      this.state.notifications.unshift({
        id: Date.now() + Math.random(),
        to: friend.name,
        from: fromName,
        type: type,
        content: content,
        time: timeStr,
        read: false
      });
    });
    this.save();
  },

  navigate(view) {
    this.state.currentView = view;
    this.render();
  },

  render() {
    const root = document.getElementById('root');
    root.innerHTML = '';

    const app = document.createElement('div');
    app.className = 'app-container';
    app.innerHTML = this.renderView();
    root.appendChild(app);

    this.attachEvents();
  },

  renderView() {
    switch (this.state.currentView) {
      case 'home': return this.renderHome();
      case 'friends': return this.renderFriends();
      case 'groups': return this.renderGroups();
      case 'plans': return this.renderPlans();
      case 'notifications': return this.renderNotifications();
      case 'suggestions': return this.renderSuggestions();
      default: return this.renderHome();
    }
  },

  renderNav() {
    const unreadCount = this.state.notifications.filter(n => !n.read).length;
    const views = [
      { id: 'home', icon: '🏠', label: 'Ana Sayfa' },
      { id: 'friends', icon: '👥', label: 'Arkadaşlar' },
      { id: 'groups', icon: '🫂', label: 'Gruplar' },
      { id: 'plans', icon: '📅', label: 'Planlar' },
      { id: 'suggestions', icon: '💡', label: 'Öneriler' },
      { id: 'notifications', icon: '🔔', label: 'Bildirimler', badge: unreadCount },
    ];

    return `
      <nav class="bottom-nav">
        ${views.map(v => `
          <button class="nav-item ${this.state.currentView === v.id ? 'active' : ''}" data-nav="${v.id}">
            <span class="nav-icon">${v.icon}${v.badge ? `<span class="badge">${v.badge}</span>` : ''}</span>
            <span class="nav-label">${v.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  },

  renderHome() {
    const friendCount = this.state.friends.length;
    const groupCount = this.state.groups.length;
    const planCount = this.state.plans.length;
    const unread = this.state.notifications.filter(n => !n.read).length;

    return `
      <div class="screen">
        <div class="header">
          <div class="header-logo">
            <span class="logo-icon">🌟</span>
            <div>
              <h1 class="logo-text">DostOS</h1>
              <p class="logo-sub">Planla, Paylaş, Yaşa.</p>
            </div>
          </div>
        </div>

        <div class="scroll-area">
          <div class="welcome-card">
            <div class="welcome-emoji">👋</div>
            <h2>Hoş geldin!</h2>
            <p>Arkadaşlarınla planlar yap, gruplar oluştur ve önerilerini paylaş.</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card" data-nav="friends">
              <span class="stat-icon">👥</span>
              <span class="stat-num">${friendCount}</span>
              <span class="stat-label">Arkadaş</span>
            </div>
            <div class="stat-card" data-nav="groups">
              <span class="stat-icon">🫂</span>
              <span class="stat-num">${groupCount}</span>
              <span class="stat-label">Grup</span>
            </div>
            <div class="stat-card" data-nav="plans">
              <span class="stat-icon">📅</span>
              <span class="stat-num">${planCount}</span>
              <span class="stat-label">Plan</span>
            </div>
            <div class="stat-card" data-nav="notifications">
              <span class="stat-icon">🔔</span>
              <span class="stat-num">${unread}</span>
              <span class="stat-label">Bildirim</span>
            </div>
          </div>

          <div class="quick-actions">
            <h3 class="section-title">Hızlı İşlemler</h3>
            <div class="action-grid">
              <button class="action-btn" data-nav="friends">
                <span>👤➕</span>
                <span>Arkadaş Ekle</span>
              </button>
              <button class="action-btn" data-nav="plans">
                <span>📅➕</span>
                <span>Plan Oluştur</span>
              </button>
              <button class="action-btn" data-nav="suggestions">
                <span>💡➕</span>
                <span>Öneri Paylaş</span>
              </button>
              <button class="action-btn" data-nav="groups">
                <span>🫂➕</span>
                <span>Grup Kur</span>
              </button>
            </div>
          </div>

          ${this.state.notifications.filter(n => !n.read).length > 0 ? `
          <div class="recent-section">
            <h3 class="section-title">Son Bildirimler</h3>
            ${this.state.notifications.filter(n => !n.read).slice(0, 3).map(n => `
              <div class="notif-item">
                <span class="notif-icon">${this.getTypeIcon(n.type)}</span>
                <div class="notif-body">
                  <p><strong>${n.from}</strong> → <strong>${n.to}</strong></p>
                  <p class="notif-content">${n.content}</p>
                  <p class="notif-time">${n.time}</p>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>

        ${this.renderNav()}
      </div>
    `;
  },

  renderFriends() {
    return `
      <div class="screen">
        <div class="header">
          <button class="back-btn" data-nav="home">←</button>
          <h2>Arkadaşlar</h2>
          <span class="count-badge">${this.state.friends.length}</span>
        </div>

        <div class="scroll-area">
          <div class="add-form card">
            <h3>Yeni Arkadaş Ekle</h3>
            <input type="text" id="friend-name" placeholder="Arkadaşın adı..." class="input-field" />
            <input type="text" id="friend-emoji" placeholder="Emoji (opsiyonel, örn: 🎮)" class="input-field" />
            <button class="btn-primary" id="add-friend-btn">➕ Arkadaş Ekle</button>
          </div>

          <div class="list-section">
            ${this.state.friends.length === 0 ? `
              <div class="empty-state">
                <span>👥</span>
                <p>Henüz arkadaş eklemedin.</p>
              </div>
            ` : this.state.friends.map(f => `
              <div class="friend-card card">
                <div class="friend-info">
                  <span class="friend-avatar">${f.emoji || '👤'}</span>
                  <div>
                    <p class="friend-name">${f.name}</p>
                    <p class="friend-date">Eklenme: ${f.addedAt}</p>
                  </div>
                </div>
                <button class="btn-danger-sm" data-remove-friend="${f.id}">🗑️</button>
              </div>
            `).join('')}
          </div>
        </div>

        ${this.renderNav()}
      </div>
    `;
  },

  renderGroups() {
    return `
      <div class="screen">
        <div class="header">
          <button class="back-btn" data-nav="home">←</button>
          <h2>Gruplar</h2>
          <span class="count-badge">${this.state.groups.length}</span>
        </div>

        <div class="scroll-area">
          <div class="add-form card">
            <h3>Yeni Grup Oluştur</h3>
            <input type="text" id="group-name" placeholder="Grup adı..." class="input-field" />
            <input type="text" id="group-emoji" placeholder="Emoji (opsiyonel, örn: 🎯)" class="input-field" />
            <div class="friend-select-area">
              <p class="select-label">Üye Seç:</p>
              ${this.state.friends.length === 0 ? '<p class="hint-text">Önce arkadaş ekleyin</p>' : 
                this.state.friends.map(f => `
                  <label class="checkbox-item">
                    <input type="checkbox" class="group-member-cb" value="${f.id}" data-name="${f.name}" />
                    <span>${f.emoji || '👤'} ${f.name}</span>
                  </label>
                `).join('')
              }
            </div>
            <button class="btn-primary" id="add-group-btn">➕ Grup Oluştur</button>
          </div>

          <div class="list-section">
            ${this.state.groups.length === 0 ? `
              <div class="empty-state">
                <span>🫂</span>
                <p>Henüz grup oluşturmadın.</p>
              </div>
            ` : this.state.groups.map(g => `
              <div class="group-card card">
                <div class="group-header">
                  <span class="group-avatar">${g.emoji || '🫂'}</span>
                  <div>
                    <p class="group-name">${g.name}</p>
                    <p class="group-members">${g.members.length} üye: ${g.members.join(', ')}</p>
                  </div>
                  <button class="btn-danger-sm" data-remove-group="${g.id}">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${this.renderNav()}
      </div>
    `;
  },

  renderPlans() {
    return `
      <div class="screen">
        <div class="header">
          <button class="back-btn" data-nav="home">←</button>
          <h2>Planlar</h2>
          <span class="count-badge">${this.state.plans.length}</span>
        </div>

        <div class="scroll-area">
          <div class="add-form card">
            <h3>Yeni Plan Oluştur</h3>
            <input type="text" id="plan-title" placeholder="Plan başlığı..." class="input-field" />
            <input type="text" id="plan-desc" placeholder="Açıklama..." class="input-field" />
            <input type="date" id="plan-date" class="input-field" />
            <p class="hint-text">💡 Bu plan tüm arkadaşlarına bildirim olarak gönderilecek.</p>
            <button class="btn-primary" id="add-plan-btn">📅 Plan Oluştur & Paylaş</button>
          </div>

          <div class="list-section">
            ${this.state.plans.length === 0 ? `
              <div class="empty-state">
                <span>📅</span>
                <p>Henüz plan oluşturmadın.</p>
              </div>
            ` : this.state.plans.map(p => `
              <div class="plan-card card">
                <div class="plan-header">
                  <span class="plan-icon">📅</span>
                  <div class="plan-info">
                    <p class="plan-title">${p.title}</p>
                    ${p.desc ? `<p class="plan-desc">${p.desc}</p>` : ''}
                    ${p.date ? `<p class="plan-date-text">📆 ${p.date}</p>` : ''}
                    <p class="plan-shared">✅ ${this.state.friends.length} arkadaşa paylaşıldı</p>
                  </div>
                  <button class="btn-danger-sm" data-remove-plan="${p.id}">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${this.renderNav()}
      </div>
    `;
  },

  renderSuggestions() {
    return `
      <div class="screen">
        <div class="header">
          <button class="back-btn" data-nav="home">←</button>
          <h2>Öneriler</h2>
          <span class="count-badge">${this.state.suggestions.length}</span>
        </div>

        <div class="scroll-area">
          <div class="add-form card">
            <h3>Yeni Öneri Paylaş</h3>
            <p class="hint-text">🌟 Öneriniz tüm arkadaşlarınıza otomatik gönderilir.</p>
            <select id="suggestion-type" class="input-field">
              <option value="film">🎬 Film / Dizi</option>
              <option value="muzik">🎵 Müzik</option>
              <option value="mekan">📍 Mekan</option>
              <option value="yemek">🍽️ Yemek / Tarif</option>
              <option value="kitap">📚 Kitap</option>
              <option value="oyun">🎮 Oyun</option>
              <option value="etkinlik">🎉 Etkinlik</option>
              <option value="diger">💬 Diğer</option>
            </select>
            <input type="text" id="suggestion-title" placeholder="Öneri başlığı..." class="input-field" />
            <textarea id="suggestion-desc" placeholder="Açıklama (opsiyonel)..." class="input-field textarea-field" rows="3"></textarea>
            <button class="btn-primary" id="add-suggestion-btn">💡 Öneriyi Tüm Arkadaşlara Gönder</button>
          </div>

          <div class="list-section">
            ${this.state.suggestions.length === 0 ? `
              <div class="empty-state">
                <span>💡</span>
                <p>Henüz öneri paylaşmadın.</p>
              </div>
            ` : this.state.suggestions.map(s => `
              <div class="suggestion-card card">
                <div class="suggestion-header">
                  <span class="suggestion-icon">${this.getSuggestionIcon(s.type)}</span>
                  <div class="suggestion-info">
                    <p class="suggestion-title">${s.title}</p>
                    ${s.desc ? `<p class="suggestion-desc">${s.desc}</p>` : ''}
                    <p class="suggestion-meta">${this.getSuggestionLabel(s.type)} • ${s.time}</p>
                    <p class="suggestion-shared">✅ ${this.state.friends.length} arkadaşa gönderildi</p>
                  </div>
                  <button class="btn-danger-sm" data-remove-suggestion="${s.id}">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${this.renderNav()}
      </div>
    `;
  },

  renderNotifications() {
    const unread = this.state.notifications.filter(n => !n.read);
    const read = this.state.notifications.filter(n => n.read);

    return `
      <div class="screen">
        <div class="header">
          <button class="back-btn" data-nav="home">←</button>
          <h2>Bildirimler</h2>
          ${unread.length > 0 ? `<button class="btn-sm" id="mark-all-read">Tümünü Oku</button>` : ''}
        </div>

        <div class="scroll-area">
          ${this.state.notifications.length === 0 ? `
            <div class="empty-state">
              <span>🔔</span>
              <p>Henüz bildirim yok.</p>
            </div>
          ` : `
            ${unread.length > 0 ? `
              <h3 class="section-title">Okunmamış (${unread.length})</h3>
              ${unread.map(n => this.renderNotifItem(n, false)).join('')}
            ` : ''}
            ${read.length > 0 ? `
              <h3 class="section-title">Okunmuş</h3>
              ${read.map(n => this.renderNotifItem(n, true)).join('')}
            ` : ''}
          `}
        </div>

        ${this.renderNav()}
      </div>
    `;
  },

  renderNotifItem(n, isRead) {
    return `
      <div class="notif-card card ${isRead ? 'read' : 'unread'}" data-notif-id="${n.id}">
        <span class="notif-type-icon">${this.getTypeIcon(n.type)}</span>
        <div class="notif-body">
          <p class="notif-header"><strong>${n.from}</strong> → <strong>${n.to}</strong></p>
          <p class="notif-content">${n.content}</p>
          <p class="notif-time">${n.time}</p>
        </div>
        ${!isRead ? `<span class="unread-dot"></span>` : ''}
      </div>
    `;
  },

  getTypeIcon(type) {
    const icons = {
      plan: '📅', suggestion: '💡', film: '🎬', muzik: '🎵',
      mekan: '📍', yemek: '🍽️', kitap: '📚', oyun: '🎮',
      etkinlik: '🎉', diger: '💬', friend: '👤'
    };
    return icons[type] || '📢';
  },

  getSuggestionIcon(type) {
    return this.getTypeIcon(type);
  },

  getSuggestionLabel(type) {
    const labels = {
      film: 'Film / Dizi', muzik: 'Müzik', mekan: 'Mekan',
      yemek: 'Yemek', kitap: 'Kitap', oyun: 'Oyun',
      etkinlik: 'Etkinlik', diger: 'Diğer'
    };
    return labels[type] || 'Öneri';
  },

  attachEvents() {
    // Navigation
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => this.navigate(el.dataset.nav));
    });

    // Arkadaş ekle
    const addFriendBtn = document.getElementById('add-friend-btn');
    if (addFriendBtn) {
      addFriendBtn.addEventListener('click', () => {
        const name = document.getElementById('friend-name').value.trim();
        const emoji = document.getElementById('friend-emoji').value.trim();
        if (!name) { this.showToast('Arkadaş adı girin!', 'error'); return; }

        const friend = {
          id: Date.now(),
          name,
          emoji: emoji || '👤',
          addedAt: new Date().toLocaleDateString('tr-TR')
        };
        this.state.friends.push(friend);
        this.save();
        this.showToast(`${name} arkadaş listene eklendi! 🎉`, 'success');
        this.render();
      });
    }

    // Arkadaş sil
    document.querySelectorAll('[data-remove-friend]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.removeFriend);
        const friend = this.state.friends.find(f => f.id === id);
        this.state.friends = this.state.friends.filter(f => f.id !== id);
        this.save();
        this.showToast(`${friend?.name} silindi.`, 'info');
        this.render();
      });
    });

    // Grup ekle
    const addGroupBtn = document.getElementById('add-group-btn');
    if (addGroupBtn) {
      addGroupBtn.addEventListener('click', () => {
        const name = document.getElementById('group-name').value.trim();
        const emoji = document.getElementById('group-emoji').value.trim();
        const checked = document.querySelectorAll('.group-member-cb:checked');
        const members = Array.from(checked).map(cb => cb.dataset.name);

        if (!name) { this.showToast('Grup adı girin!', 'error'); return; }

        const group = {
          id: Date.now(),
          name,
          emoji: emoji || '🫂',
          members,
          createdAt: new Date().toLocaleDateString('tr-TR')
        };
        this.state.groups.push(group);
        this.save();
        this.showToast(`"${name}" grubu oluşturuldu! 🫂`, 'success');
        this.render();
      });
    }

    // Grup sil
    document.querySelectorAll('[data-remove-group]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.removeGroup);
        const group = this.state.groups.find(g => g.id === id);
        this.state.groups = this.state.groups.filter(g => g.id !== id);
        this.save();
        this.showToast(`"${group?.name}" grubu silindi.`, 'info');
        this.render();
      });
    });

    // Plan ekle
    const addPlanBtn = document.getElementById('add-plan-btn');
    if (addPlanBtn) {
      addPlanBtn.addEventListener('click', () => {
        const title = document.getElementById('plan-title').value.trim();
        const desc = document.getElementById('plan-desc').value.trim();
        const date = document.getElementById('plan-date').value;

        if (!title) { this.showToast('Plan başlığı girin!', 'error'); return; }

        const plan = {
          id: Date.now(),
          title,
          desc,
          date,
          createdAt: new Date().toLocaleDateString('tr-TR')
        };
        this.state.plans.push(plan);

        // Tüm arkadaşlara bildirim gönder
        const content = `Yeni plan: "${title}"${desc ? ' - ' + desc : ''}${date ? ' (' + date + ')' : ''}`;
        this.notifyAllFriends('plan', content);

        this.showToast(`Plan oluşturuldu ve ${this.state.friends.length} arkadaşına gönderildi! 📅`, 'success');
        this.render();
      });
    }

    // Plan sil
    document.querySelectorAll('[data-remove-plan]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.removePlan);
        this.state.plans = this.state.plans.filter(p => p.id !== id);
        this.save();
        this.showToast('Plan silindi.', 'info');
        this.render();
      });
    });

    // Öneri ekle
    const addSuggestionBtn = document.getElementById('add-suggestion-btn');
    if (addSuggestionBtn) {
      addSuggestionBtn.addEventListener('click', () => {
        const type = document.getElementById('suggestion-type').value;
        const title = document.getElementById('suggestion-title').value.trim();
        const desc = document.getElementById('suggestion-desc').value.trim();

        if (!title) { this.showToast('Öneri başlığı girin!', 'error'); return; }

        const suggestion = {
          id: Date.now(),
          type,
          title,
          desc,
          time: new Date().toLocaleString('tr-TR')
        };
        this.state.suggestions.push(suggestion);

        // Tüm arkadaşlara bildirim gönder
        const label = this.getSuggestionLabel(type);
        const content = `${label} önerisi: "${title}"${desc ? ' - ' + desc : ''}`;
        this.notifyAllFriends(type, content);

        this.showToast(`Öneri ${this.state.friends.length} arkadaşına gönderildi! 💡`, 'success');
        this.render();
      });
    }

    // Öneri sil
    document.querySelectorAll('[data-remove-suggestion]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.removeSuggestion);
        this.state.suggestions = this.state.suggestions.filter(s => s.id !== id);
        this.save();
        this.showToast('Öneri silindi.', 'info');
        this.render();
      });
    });

    // Tümünü okundu işaretle
    const markAllRead = document.getElementById('mark-all-read');
    if (markAllRead) {
      markAllRead.addEventListener('click', () => {
        this.state.notifications.forEach(n => n.read = true);
        this.save();
        this.render();
      });
    }

    // Bildirime tıklayınca okundu işaretle
    document.querySelectorAll('[data-notif-id]').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseFloat(el.dataset.notifId);
        const notif = this.state.notifications.find(n => n.id === id);
        if (notif) {
          notif.read = true;
          this.save();
          this.render();
        }
      });
    });
  },

  showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  init() {
    this.render();
  }
};

// Uygulama başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

// PWA Yükleme Butonu
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  const installBtn = document.createElement('button');
  installBtn.id = 'pwa-install-btn';
  installBtn.innerHTML = '📲 Ana Ekrana Ekle';
  installBtn.style.display = 'block';
  document.body.appendChild(installBtn);
  
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.remove();
      }
      deferredPrompt = null;
    }
  });
});

window.addEventListener('appinstalled', () => {
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.remove();
  deferredPrompt = null;
});
