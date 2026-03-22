// ===== WordCards App Logic (Premium UI) =====

const App = {
  // 状态
  data: {
    decks: [],
    settings: {
      theme: 'light',
      language: 'zh-CN'
    }
  },
  
  // 当前操作
  currentDeckId: null,
  currentDeckIndex: -1,
  currentCardIndex: 0,
  studyCards: [],
  isFlipped: false,
  
  // 语言翻译
  translations: {
    'zh-CN': {
      title: '我的卡组',
      createDeck: '创建卡组',
      editDeck: '编辑卡组',
      deckName: '卡组名称',
      totalCards: '总卡片数',
      studied: '已学习',
      addCard: '添加卡片',
      editCard: '编辑卡片',
      front: '正面（单词/问题）',
      back: '背面（解释/答案）',
      save: '保存',
      cancel: '取消',
      study: '开始学习',
      know: '认识',
      dontKnow: '不认识',
      settings: '设置',
      theme: '主题',
      language: '界面语言',
      export: '导出',
      import: '导入',
      version: '版本',
      noDecks: '还没有创建任何卡组',
      noCards: '还没有添加任何卡片',
      tapToFlip: '点击卡片翻转',
      progress: '进度',
      light: '浅色',
      dark: '深色',
      appearance: '外观',
      data: '数据',
      about: '关于',
      deleteConfirm: '确定删除吗？',
      deleteDeck: '删除卡组',
      deleteCard: '删除卡片',
      emptyTitle: '还没有卡组',
      emptyDesc: '创建你的第一个卡片组，开始记忆之旅',
      createFirst: '创建卡组'
    },
    'en': {
      title: 'My Decks',
      createDeck: 'Create Deck',
      editDeck: 'Edit Deck',
      deckName: 'Deck Name',
      totalCards: 'Total Cards',
      studied: 'Studied',
      addCard: 'Add Card',
      editCard: 'Edit Card',
      front: 'Front (word/question)',
      back: 'Back (definition/answer)',
      save: 'Save',
      cancel: 'Cancel',
      study: 'Study',
      know: 'Know',
      dontKnow: "Don't Know",
      settings: 'Settings',
      theme: 'Theme',
      language: 'Language',
      export: 'Export',
      import: 'Import',
      version: 'Version',
      noDecks: 'No decks yet',
      noCards: 'No cards yet',
      tapToFlip: 'Tap to flip',
      progress: 'Progress',
      light: 'Light',
      dark: 'Dark',
      appearance: 'Appearance',
      data: 'Data',
      about: 'About',
      deleteConfirm: 'Delete this?',
      deleteDeck: 'Delete Deck',
      deleteCard: 'Delete Card',
      emptyTitle: 'No Decks Yet',
      emptyDesc: 'Create your first deck and start your learning journey',
      createFirst: 'Create Deck'
    }
  },
  
  // 初始化
  init() {
    this.loadData();
    this.render();
    this.bindEvents();
    this.applyTheme();
  },
  
  // 加载数据
  loadData() {
    try {
      const saved = localStorage.getItem('wordcards_data');
      if (saved) {
        this.data = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Load data error:', e);
    }
  },
  
  // 保存数据
  saveData() {
    try {
      localStorage.setItem('wordcards_data', JSON.stringify(this.data));
    } catch (e) {
      console.error('Save data error:', e);
    }
  },
  
  // 获取翻译
  t(key) {
    const lang = this.data.settings.language || 'zh-CN';
    return this.translations[lang]?.[key] || this.translations['zh-CN'][key] || key;
  },
  
  // 渲染
  render() {
    this.renderDeckList();
    this.renderSettings();
  },
  
  // 渲染卡组列表
  renderDeckList() {
    const listEl = document.getElementById('deck-list');
    const emptyEl = document.getElementById('empty-state');
    const addDeckBtnEmpty = document.getElementById('add-deck-btn-empty');
    
    if (addDeckBtnEmpty) {
      addDeckBtnEmpty.onclick = () => this.showDeckModal();
    }
    
    if (this.data.decks.length === 0) {
      if (listEl) listEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'flex';
      return;
    }
    
    if (listEl) {
      listEl.style.display = 'block';
      listEl.innerHTML = this.data.decks.map((deck, index) => `
        <div class="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl hover:border-primary-200 transition-all animate-fadeIn" data-index="${index}" style="animation-delay: ${index * 0.1}s">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                ${deck.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 class="font-bold text-gray-800 text-lg">${this.escapeHtml(deck.name)}</h3>
                <p class="text-sm text-gray-500">${deck.cards.length} 张卡片</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-center px-3">
                <div class="text-2xl font-bold text-emerald-500">${this.getStudiedCount(deck)}</div>
                <div class="text-xs text-gray-400">已学习</div>
              </div>
              <i class="fas fa-chevron-right text-gray-300"></i>
            </div>
          </div>
        </div>
      `).join('');
    }
    
    if (emptyEl) emptyEl.style.display = 'none';
  },
  
  // 获取已学习数量
  getStudiedCount(deck) {
    return deck.cards.filter(c => c.studied).length;
  },
  
  // 渲染设置页
  renderSettings() {
    const themeSelect = document.getElementById('theme-select');
    const langSelect = document.getElementById('language-select');
    if (themeSelect) themeSelect.value = this.data.settings.theme;
    if (langSelect) langSelect.value = this.data.settings.language;
  },
  
  // 应用主题
  applyTheme() {
    // 可以在这里扩展深色主题
  },
  
  // 绑定事件
  bindEvents() {
    // 首页
    document.getElementById('settings-btn').onclick = () => this.showPage('settings-page');
    document.getElementById('add-deck-btn').onclick = () => this.showDeckModal();
    
    // 卡组列表点击
    document.getElementById('deck-list').onclick = (e) => {
      const card = e.target.closest('.bg-white');
      if (card) {
        const index = parseInt(card.dataset.index);
        this.openDeck(index);
      }
    };
    
    // 卡组详情页
    document.getElementById('back-to-home').onclick = () => this.showPage('home-page');
    document.getElementById('edit-deck-btn').onclick = () => this.showDeckModal(this.currentDeckIndex);
    document.getElementById('add-card-btn').onclick = () => this.showCardModal();
    document.getElementById('study-btn').onclick = () => this.startStudy();
    
    // 学习页
    document.getElementById('exit-study').onclick = () => this.exitStudy();
    document.getElementById('flashcard').onclick = () => this.flipCard();
    document.getElementById('btn-know').onclick = () => this.markCard(true);
    document.getElementById('btn-dont-know').onclick = () => this.markCard(false);
    
    // 设置页
    document.getElementById('back-from-settings').onclick = () => this.showPage('home-page');
    document.getElementById('theme-select').onchange = (e) => this.setTheme(e.target.value);
    document.getElementById('language-select').onchange = (e) => this.setLanguage(e.target.value);
    document.getElementById('export-data-btn').onclick = () => this.exportData();
    document.getElementById('import-data-btn').onclick = () => document.getElementById('import-file-input').click();
    document.getElementById('import-file-input').onchange = (e) => this.importData(e);
    
    // 卡组弹窗
    document.getElementById('cancel-deck-btn').onclick = () => this.hideDeckModal();
    document.getElementById('save-deck-btn').onclick = () => this.saveDeck();
    
    // 卡片弹窗
    document.getElementById('cancel-card-btn').onclick = () => this.hideCardModal();
    document.getElementById('save-card-btn').onclick = () => this.saveCard();
  },
  
  // 显示页面
  showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
  },
  
  // 打开卡组
  openDeck(index) {
    this.currentDeckIndex = index;
    this.currentDeckId = this.data.decks[index].id;
    
    const deck = this.data.decks[index];
    document.getElementById('deck-title').textContent = deck.name;
    document.getElementById('total-cards').textContent = deck.cards.length;
    document.getElementById('studied-cards').textContent = this.getStudiedCount(deck);
    
    this.renderCardList();
    this.showPage('deck-detail-page');
  },
  
  // 渲染卡片列表
  renderCardList() {
    const listEl = document.getElementById('card-list');
    const deck = this.data.decks[this.currentDeckIndex];
    
    if (!deck.cards.length) {
      listEl.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fas fa-plus text-2xl text-gray-400"></i>
          </div>
          <p class="text-gray-500">${this.t('noCards')}</p>
        </div>
      `;
      return;
    }
    
    listEl.innerHTML = deck.cards.map((card, index) => `
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all" data-index="${index}">
        <div class="font-medium text-gray-800">${this.escapeHtml(card.front)}</div>
        <div class="text-sm text-gray-500 mt-1">${this.escapeHtml(card.back)}</div>
      </div>
    `).join('');
    
    // 点击卡片编辑
    listEl.onclick = (e) => {
      const item = e.target.closest('.bg-white');
      if (item) {
        const index = parseInt(item.dataset.index);
        this.showCardModal(index);
      }
    };
  },
  
  // 卡组弹窗
  showDeckModal(index = -1) {
    const modal = document.getElementById('deck-modal');
    const title = document.getElementById('deck-modal-title');
    const input = document.getElementById('deck-name-input');
    
    if (index >= 0) {
      title.textContent = this.t('editDeck');
      input.value = this.data.decks[index].name;
      this.currentDeckIndex = index;
    } else {
      title.textContent = this.t('createDeck');
      input.value = '';
      this.currentDeckIndex = -1;
    }
    
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
  },
  
  hideDeckModal() {
    document.getElementById('deck-modal').classList.remove('active');
  },
  
  saveDeck() {
    const name = document.getElementById('deck-name-input').value.trim();
    if (!name) return;
    
    if (this.currentDeckIndex >= 0) {
      this.data.decks[this.currentDeckIndex].name = name;
    } else {
      this.data.decks.push({
        id: this.generateId(),
        name: name,
        cards: [],
        createdAt: Date.now(),
        lastStudied: null
      });
    }
    
    this.saveData();
    this.renderDeckList();
    this.hideDeckModal();
  },
  
  // 卡片弹窗
  showCardModal(index = -1) {
    const modal = document.getElementById('card-modal');
    const title = document.getElementById('card-modal-title');
    const frontInput = document.getElementById('card-front-input');
    const backInput = document.getElementById('card-back-input');
    
    if (index >= 0) {
      title.textContent = this.t('editCard');
      const card = this.data.decks[this.currentDeckIndex].cards[index];
      frontInput.value = card.front;
      backInput.value = card.back;
      this.currentCardIndex = index;
    } else {
      title.textContent = this.t('addCard');
      frontInput.value = '';
      backInput.value = '';
      this.currentCardIndex = -1;
    }
    
    modal.classList.add('active');
    setTimeout(() => frontInput.focus(), 100);
  },
  
  hideCardModal() {
    document.getElementById('card-modal').classList.remove('active');
  },
  
  saveCard() {
    const front = document.getElementById('card-front-input').value.trim();
    const back = document.getElementById('card-back-input').value.trim();
    if (!front || !back) return;
    
    const deck = this.data.decks[this.currentDeckIndex];
    
    if (this.currentCardIndex >= 0) {
      deck.cards[this.currentCardIndex].front = front;
      deck.cards[this.currentCardIndex].back = back;
    } else {
      deck.cards.push({
        id: this.generateId(),
        front: front,
        back: back,
        studied: false,
        createdAt: Date.now()
      });
    }
    
    this.saveData();
    this.renderCardList();
    this.updateDeckStats();
    this.hideCardModal();
  },
  
  updateDeckStats() {
    const deck = this.data.decks[this.currentDeckIndex];
    document.getElementById('total-cards').textContent = deck.cards.length;
    document.getElementById('studied-cards').textContent = this.getStudiedCount(deck);
  },
  
  // 学习模式
  startStudy() {
    const deck = this.data.decks[this.currentDeckIndex];
    if (deck.cards.length === 0) {
      alert(this.t('noCards'));
      return;
    }
    
    // 随机打乱
    this.studyCards = [...deck.cards].sort(() => Math.random() - 0.5);
    this.currentCardIndex = 0;
    this.isFlipped = false;
    
    this.renderStudyCard();
    this.showPage('study-page');
  },
  
  renderStudyCard() {
    const card = this.studyCards[this.currentCardIndex];
    if (!card) {
      this.exitStudy();
      return;
    }
    
    document.getElementById('card-front-text').textContent = card.front;
    document.getElementById('card-back-text').textContent = card.back;
    document.getElementById('study-progress').textContent = 
      `${this.currentCardIndex + 1} / ${this.studyCards.length}`;
    
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');
    this.isFlipped = false;
  },
  
  flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    this.isFlipped = !this.isFlipped;
  },
  
  markCard(known) {
    const card = this.studyCards[this.currentCardIndex];
    if (known) {
      // 标记为已学习
      const deck = this.data.decks[this.currentDeckIndex];
      const originalCard = deck.cards.find(c => c.id === card.id);
      if (originalCard) {
        originalCard.studied = true;
        this.saveData();
      }
    }
    
    // 下一张
    this.currentCardIndex++;
    if (this.currentCardIndex >= this.studyCards.length) {
      alert('🎉 学习完成！');
      this.exitStudy();
    } else {
      this.renderStudyCard();
    }
  },
  
  exitStudy() {
    this.renderDeckList();
    this.showPage('deck-detail-page');
  },
  
  // 设置
  setTheme(theme) {
    this.data.settings.theme = theme;
    this.saveData();
    this.applyTheme();
  },
  
  setLanguage(lang) {
    this.data.settings.language = lang;
    this.saveData();
    this.render();
  },
  
  // 导出数据
  exportData() {
    const dataStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wordcards_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  // 导入数据
  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.decks && Array.isArray(imported.decks)) {
          this.data = imported;
          this.saveData();
          this.render();
          alert('导入成功！');
        } else {
          alert('无效的数据格式');
        }
      } catch (err) {
        alert('导入失败：' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },
  
  // 工具
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => App.init());
