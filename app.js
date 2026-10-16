/**
 * ===================================================================
 * NEXUSLINK HUB - APLIKASI DASHBOARD PORTAL TAUTAN TERPUSAT
 * Fitur: Kontrol Akses Admin, CRUD Tautan, Filter Realtime,
 *        Statistik Klik, Pencadangan JSON, & Antarmuka Modern.
 * ===================================================================
 */

// Kunci Penyimpanan Lokal (LocalStorage Keys)
const STORAGE_KEYS = {
  LINKS: 'nexuslink_items',
  CATEGORIES: 'nexuslink_categories',
  ADMIN_SESSION: 'nexuslink_admin_active',
  ADMIN_PASSWORD: 'nexuslink_admin_pwd',
  FIREBASE_CUSTOM: 'nexuslink_firebase_custom_config'
};

// Kata Sandi Admin Bawaan (Default Password)
const DEFAULT_ADMIN_PASSWORD = 'admin123';

// Data Sampel Awal (Initial Seed Data)
const INITIAL_CATEGORIES = ['Pengembangan', 'Operasional', 'Desain & UI', 'Internal HR', 'Infrastruktur'];

const INITIAL_LINKS = [
  {
    id: 'link-1',
    title: 'Repositori Proyek GitHub',
    url: 'https://github.com',
    description: 'Akses ke seluruh repositori kode sumber, pull request, dan issue tracking organisasi.',
    category: 'Pengembangan',
    iconType: 'preset-code',
    badgeColor: 'blue',
    clicks: 142,
    isPinned: true,
    isVisible: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  {
    id: 'link-2',
    title: 'AWS Cloud Console & Cluster',
    url: 'https://aws.amazon.com/console',
    description: 'Manajemen server production, kontainer Kubernetes, dan layanan cloud microservices.',
    category: 'Infrastruktur',
    iconType: 'preset-server',
    badgeColor: 'amber',
    clicks: 98,
    isPinned: true,
    isVisible: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4
  },
  {
    id: 'link-3',
    title: 'Figma Design System & UI Kit',
    url: 'https://figma.com',
    description: 'Pusat komponen desain, prototype antarmuka pengguna, dan guideline visual produk.',
    category: 'Desain & UI',
    iconType: 'preset-document',
    badgeColor: 'purple',
    clicks: 74,
    isPinned: false,
    isVisible: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'link-4',
    title: 'Portal HR & Pengajuan Cuti',
    url: 'https://workday.com',
    description: 'Sistem absensi karyawan, formulir klaim biaya, dan informasi slip gaji bulanan.',
    category: 'Internal HR',
    iconType: 'preset-shield',
    badgeColor: 'emerald',
    clicks: 53,
    isPinned: false,
    isVisible: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'link-5',
    title: 'Dashboard Analitik Metrik Bisnis',
    url: 'https://analytics.google.com',
    description: 'Pantauan performa kunjungan harian, konversi pengguna, dan statistik performa aplikasi.',
    category: 'Operasional',
    iconType: 'preset-analytics',
    badgeColor: 'cyan',
    clicks: 86,
    isPinned: false,
    isVisible: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  },
  {
    id: 'link-6',
    title: 'Dokumentasi API & Integrasi',
    url: 'https://postman.com',
    description: 'Spesifikasi endpoint REST API, koleksi pengujian endpoint, dan panduan integrasi partner.',
    category: 'Pengembangan',
    iconType: 'preset-code',
    badgeColor: 'rose',
    clicks: 41,
    isPinned: false,
    isVisible: true,
    createdAt: Date.now()
  }
];

// SVG Icon Helpers
const ICONS = {
  server: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
  code: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  document: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  analytics: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  shield: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  chat: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  external: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  pin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4H17V2H7V4H8V12L5 15V17H11V22H13V17H19V15L16 12Z"/></svg>`,
  copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  eye: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  edit: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`
};

/* ===================================================================
   STATE APLIKASI
   =================================================================== */
class AppState {
  constructor() {
    this.isAdmin = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    this.links = this.loadLinks();
    this.categories = this.loadCategories();
    this.currentCategory = 'Semua';
    this.searchQuery = '';
    this.currentSort = 'newest';
  }

  loadLinks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LINKS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Gagal memuat link dari storage:', e);
    }
    // Jika belum ada, simpan data sampel bawaan
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(INITIAL_LINKS));
    return [...INITIAL_LINKS];
  }

  saveLinksLocal() {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(this.links));
  }

  saveLinks() {
    this.saveLinksLocal();
  }

  loadCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Gagal memuat kategori dari storage:', e);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return [...INITIAL_CATEGORIES];
  }

  saveCategoriesLocal() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
  }

  saveCategories() {
    this.saveCategoriesLocal();
    FirebaseService.syncCategories(this.categories).catch(err => console.warn('Sync categories err:', err));
  }

  setAdminStatus(status) {
    this.isAdmin = status;
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, status ? 'true' : 'false');
  }

  setAdminPasswordLocal(newPassword) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
  }

  async setAdminPassword(newPassword) {
    this.setAdminPasswordLocal(newPassword);
    if (FirebaseService.isInitialized) {
      await FirebaseService.syncAdminPassword(newPassword);
    }
  }

  getAdminPassword() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASSWORD;
  }
}

// Inisialisasi Objek Global State
const state = new AppState();

/* ===================================================================
   LAYANAN DATABASE CLOUD FIREBASE (FIRESTORE)
   =================================================================== */
const FirebaseService = {
  db: null,
  isInitialized: false,
  isConnected: false,
  unsubscribeLinks: null,
  unsubscribeMeta: null,
  unsubscribeAuth: null,

  getConfig() {
    // 1. Berkas firebase-config.js diutamakan jika sudah diisi konfigurasi valid
    if (typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('ISI_')) {
      return FIREBASE_CONFIG;
    }

    // 2. Cek konfigurasi kustom di localStorage jika admin pernah mengisi lewat modal
    const savedCustom = localStorage.getItem(STORAGE_KEYS.FIREBASE_CUSTOM);
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (parsed.apiKey && !parsed.apiKey.startsWith('ISI_')) return parsed;
      } catch (e) { }
    }

    return null;
  },

  async init() {
    const config = this.getConfig();
    if (!config) {
      this.updateStatus('offline', 'Mode Penyimpanan Lokal (Offline)', 'Tautan tersimpan di browser perangkat ini. Hubungkan Firebase agar tersinkronisasi ke semua HP/Laptop secara realtime.');
      return;
    }

    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK compat belum termuat.');
      this.updateStatus('offline', 'Koneksi Cloud Tertunda', 'SDK Firebase belum selesai dimuat. Pastikan koneksi internet aktif.');
      return;
    }

    this.updateStatus('connecting', 'Menghubungkan ke Cloud...', 'Menyambungkan ke database Firebase Firestore...');

    try {
      if (firebase.apps.length) {
        await Promise.all(firebase.apps.map(app => app.delete()));
      }
      firebase.initializeApp(config);
      this.db = firebase.firestore();
      this.isInitialized = true;
      this.listenToChanges();
    } catch (err) {
      console.error('Gagal inisialisasi Firebase:', err);
      this.updateStatus('offline', 'Koneksi Cloud Gagal', `Error: ${err.message}`);
    }
  },

  listenToChanges() {
    if (!this.db) return;

    if (this.unsubscribeLinks) this.unsubscribeLinks();
    if (this.unsubscribeMeta) this.unsubscribeMeta();
    if (this.unsubscribeAuth) this.unsubscribeAuth();

    // Listener Realtime untuk Koleksi Tautan
    this.unsubscribeLinks = this.db.collection('nexuslink_links').onSnapshot((snapshot) => {
      this.isConnected = true;
      this.updateStatus('connected', 'Cloud Database Aktif (Realtime)', 'Terhubung ke Firebase Firestore. Setiap perubahan otomatis tersinkronisasi ke seluruh pengunjung.');

      if (!snapshot.empty) {
        const remoteLinks = [];
        snapshot.forEach(doc => {
          remoteLinks.push({ id: doc.id, ...doc.data() });
        });
        state.links = remoteLinks;
        state.saveLinksLocal();
        renderLinks();
        updateStats();
      } else {
        // Jika database Firestore kosong tapi admin memiliki tautan di lokal,
        // jangan hapus tautan lokal! Sinkronkan tautan lokal ke Firestore.
        if (state.links.length > 0) {
          state.links.forEach(l => {
            this.saveLink(l).catch(err => {
              console.warn('Gagal sinkronisasi link lokal ke Cloud:', err);
            });
          });
        } else {
          state.links = [];
          state.saveLinksLocal();
          renderLinks();
          updateStats();
        }
      }
    }, (error) => {
      console.error('Firestore snapshot links error:', error);
      this.isConnected = false;
      this.updateStatus('offline', 'Sinkronisasi Cloud Terputus', `Izin baca/tulis Firestore bermasalah: ${error.message}`);
    });

    // Listener Realtime untuk Kategori
    this.unsubscribeMeta = this.db.collection('nexuslink_meta').doc('categories').onSnapshot((doc) => {
      if (doc.exists && Array.isArray(doc.data().list) && doc.data().list.length > 0) {
        state.categories = doc.data().list;
        state.saveCategoriesLocal();
        renderCategoryFilterPills();
        populateCategorySelect();
        updateStats();
      }
    }, (error) => {
      console.error('Firestore snapshot categories error:', error);
    });

    // Listener Realtime untuk Dokumen Autentikasi Admin (Sinkronisasi Antar Perangkat)
    this.unsubscribeAuth = this.db.collection('nexuslink_meta').doc('auth').onSnapshot((doc) => {
      if (doc.exists && doc.data() && doc.data().adminPassword) {
        const cloudPwd = doc.data().adminPassword;
        state.setAdminPasswordLocal(cloudPwd);
        updateRoleUI();
      } else {
        // Jika di Firestore belum tersimpan dokumen auth, tetapi di perangkat ini sudah ada sandi kustom lokal,
        // otomatis migrasikan ke Firestore agar langsung tersinkron ke semua perangkat lain!
        const currentLocalPwd = state.getAdminPassword();
        if (currentLocalPwd && currentLocalPwd !== DEFAULT_ADMIN_PASSWORD) {
          this.syncAdminPassword(currentLocalPwd).catch(err => {
            console.warn('Gagal migrasi sandi lokal ke cloud:', err);
          });
        }
      }
    }, (error) => {
      console.warn('Firestore snapshot auth error:', error);
    });
  },

  updateStatus(status, title, desc) {
    if (DOM.cloudIndicator) {
      DOM.cloudIndicator.className = `cloud-indicator ${status}${state.isAdmin ? '' : ' hidden'}`;
      if (DOM.cloudText) {
        if (status === 'connected') DOM.cloudText.textContent = 'Cloud Terhubung';
        else if (status === 'connecting') DOM.cloudText.textContent = 'Menyambungkan...';
        else DOM.cloudText.textContent = 'Mode Lokal';
      }
    }
    if (DOM.cloudStatusCard) {
      DOM.cloudStatusCard.className = `cloud-status-card ${status}`;
      if (DOM.cloudModalStatusTitle) DOM.cloudModalStatusTitle.textContent = title;
      if (DOM.cloudModalStatusDesc) DOM.cloudModalStatusDesc.textContent = desc;
    }
  },

  async saveLink(link) {
    if (this.isInitialized && this.db) {
      await this.db.collection('nexuslink_links').doc(link.id).set(link);
    }
  },

  async deleteLink(linkId) {
    if (this.isInitialized && this.db) {
      await this.db.collection('nexuslink_links').doc(linkId).delete();
    }
  },

  async updateLinkField(linkId, fields) {
    if (this.isInitialized && this.db) {
      await this.db.collection('nexuslink_links').doc(linkId).update(fields);
    }
  },

  async recordClick(linkId) {
    if (this.isInitialized && this.db && typeof firebase !== 'undefined') {
      try {
        await this.db.collection('nexuslink_links').doc(linkId).update({
          clicks: firebase.firestore.FieldValue.increment(1)
        });
      } catch (e) {
        console.warn('Gagal record click ke Cloud:', e);
      }
    }
  },

  async syncCategories(categoriesList) {
    if (this.isInitialized && this.db) {
      await this.db.collection('nexuslink_meta').doc('categories').set({ list: categoriesList });
    }
  },

  async syncAdminPassword(password) {
    if (this.isInitialized && this.db) {
      await this.db.collection('nexuslink_meta').doc('auth').set({
        adminPassword: password,
        updatedAt: Date.now()
      }, { merge: true });
    }
  },

  async getCloudPasswordDoc() {
    if (this.isInitialized && this.db) {
      const doc = await this.db.collection('nexuslink_meta').doc('auth').get();
      if (doc.exists) {
        return doc.data();
      }
    }
    return null;
  },

  async seedDefaults() {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database Firebase belum terhubung.');
    }
    const batch = this.db.batch();
    INITIAL_LINKS.forEach(link => {
      const ref = this.db.collection('nexuslink_links').doc(link.id);
      batch.set(ref, link);
    });
    const catRef = this.db.collection('nexuslink_meta').doc('categories');
    batch.set(catRef, { list: INITIAL_CATEGORIES });
    await batch.commit();
  }
};

/* ===================================================================
   ELEMEN DOM
   =================================================================== */
const DOM = {
  // Role & Admin Actions
  roleIndicator: document.getElementById('roleIndicator'),
  roleText: document.getElementById('roleText'),
  adminQuickActions: document.getElementById('adminQuickActions'),
  btnAdminAuth: document.getElementById('btnAdminAuth'),
  authIcon: document.getElementById('authIcon'),
  authBtnLabel: document.getElementById('authBtnLabel'),
  adminBanner: document.getElementById('adminBanner'),
  bannerSecurityWarning: document.getElementById('bannerSecurityWarning'),
  btnBannerQuickChangePwd: document.getElementById('btnBannerQuickChangePwd'),
  btnCloseBanner: document.getElementById('btnCloseBanner'),

  // Quick Open Modal Buttons
  btnOpenAddModal: document.getElementById('btnOpenAddModal'),
  btnOpenManageCategories: document.getElementById('btnOpenManageCategories'),
  btnOpenDataManagement: document.getElementById('btnOpenDataManagement'),
  btnOpenChangePassword: document.getElementById('btnOpenChangePassword'),
  btnEmptyAdd: document.getElementById('btnEmptyAdd'),

  // Stats Counters
  totalLinksCount: document.getElementById('totalLinksCount'),
  totalCategoriesCount: document.getElementById('totalCategoriesCount'),
  totalClicksCount: document.getElementById('totalClicksCount'),

  // Toolbar
  toolbarSection: document.getElementById('toolbarSection'),
  searchInput: document.getElementById('searchInput'),
  btnClearSearch: document.getElementById('btnClearSearch'),
  categoriesFilterBar: document.getElementById('categoriesFilterBar'),
  sortSelect: document.getElementById('sortSelect'),

  // Links Grid & Empty State
  linksGrid: document.getElementById('linksGrid'),
  emptyState: document.getElementById('emptyState'),
  emptyTitle: document.getElementById('emptyTitle'),
  emptyDescription: document.getElementById('emptyDescription'),

  // Modal Auth
  modalAdminAuth: document.getElementById('modalAdminAuth'),
  adminLoginForm: document.getElementById('adminLoginForm'),
  adminPasswordInput: document.getElementById('adminPasswordInput'),
  btnTogglePwd: document.getElementById('btnTogglePwd'),
  authErrorMsg: document.getElementById('authErrorMsg'),
  btnCloseAuthModal: document.getElementById('btnCloseAuthModal'),
  btnCancelAuth: document.getElementById('btnCancelAuth'),

  // Modal Link Editor
  modalLinkEditor: document.getElementById('modalLinkEditor'),
  linkForm: document.getElementById('linkForm'),
  linkIdInput: document.getElementById('linkIdInput'),
  linkTitleInput: document.getElementById('linkTitleInput'),
  linkCategorySelect: document.getElementById('linkCategorySelect'),
  linkUrlInput: document.getElementById('linkUrlInput'),
  linkDescriptionInput: document.getElementById('linkDescriptionInput'),
  linkIconTypeSelect: document.getElementById('linkIconTypeSelect'),
  linkBadgeColor: document.getElementById('linkBadgeColor'),
  linkIsPinned: document.getElementById('linkIsPinned'),
  linkIsVisible: document.getElementById('linkIsVisible'),
  btnCloseLinkModal: document.getElementById('btnCloseLinkModal'),
  btnCancelLinkModal: document.getElementById('btnCancelLinkModal'),
  linkModalTitle: document.getElementById('linkModalTitle'),
  linkModalSubtitle: document.getElementById('linkModalSubtitle'),
  btnSaveLinkText: document.getElementById('btnSaveLinkText'),

  // Modal Category Manager
  modalCategoryManager: document.getElementById('modalCategoryManager'),
  addCategoryForm: document.getElementById('addCategoryForm'),
  newCategoryName: document.getElementById('newCategoryName'),
  categoryItemsList: document.getElementById('categoryItemsList'),
  btnCloseCatModal: document.getElementById('btnCloseCatModal'),
  btnCloseCatModalBottom: document.getElementById('btnCloseCatModalBottom'),

  // Modal Data Manager
  modalDataManager: document.getElementById('modalDataManager'),
  btnExportData: document.getElementById('btnExportData'),
  importFileInput: document.getElementById('importFileInput'),
  btnResetDefaultData: document.getElementById('btnResetDefaultData'),
  btnCloseDataModal: document.getElementById('btnCloseDataModal'),
  btnCloseDataModalBottom: document.getElementById('btnCloseDataModalBottom'),

  // Modal Change Password
  modalChangePassword: document.getElementById('modalChangePassword'),
  changePasswordForm: document.getElementById('changePasswordForm'),
  currentPasswordInput: document.getElementById('currentPasswordInput'),
  newPasswordInput: document.getElementById('newPasswordInput'),
  confirmNewPasswordInput: document.getElementById('confirmNewPasswordInput'),
  changePwdErrorMsg: document.getElementById('changePwdErrorMsg'),
  btnToggleCurrentPwd: document.getElementById('btnToggleCurrentPwd'),
  btnToggleNewPwd: document.getElementById('btnToggleNewPwd'),
  btnCloseChangePwdModal: document.getElementById('btnCloseChangePwdModal'),
  btnCancelChangePwd: document.getElementById('btnCancelChangePwd'),

  // Cloud Indicator & Modal Firebase
  cloudIndicator: document.getElementById('cloudIndicator'),
  cloudDot: document.getElementById('cloudDot'),
  cloudText: document.getElementById('cloudText'),
  btnOpenCloudModal: document.getElementById('btnOpenCloudModal'),
  modalCloudConfig: document.getElementById('modalCloudConfig'),
  cloudStatusCard: document.getElementById('cloudStatusCard'),
  cloudModalDot: document.getElementById('cloudModalDot'),
  cloudModalStatusTitle: document.getElementById('cloudModalStatusTitle'),
  cloudModalStatusDesc: document.getElementById('cloudModalStatusDesc'),
  cloudConfigForm: document.getElementById('cloudConfigForm'),
  firebaseConfigInput: document.getElementById('firebaseConfigInput'),
  btnSaveCloudConfig: document.getElementById('btnSaveCloudConfig'),
  btnCopyFileConfig: document.getElementById('btnCopyFileConfig'),
  btnSeedCloudData: document.getElementById('btnSeedCloudData'),
  btnCloseCloudModal: document.getElementById('btnCloseCloudModal'),

  // Toasts
  toastContainer: document.getElementById('toastContainer')
};

/* ===================================================================
   TOAST NOTIFICATION HELPER
   =================================================================== */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3200);
}

/* ===================================================================
   ROLE & AUTENTIKASI ADMIN
   =================================================================== */
function updateRoleUI() {
  if (state.isAdmin) {
    // Mode Admin Aktif
    DOM.roleIndicator.classList.add('is-admin');
    DOM.roleText.textContent = 'Mode Admin (Aktif)';
    DOM.adminQuickActions.classList.remove('hidden');
    DOM.adminBanner.classList.remove('hidden');
    if (DOM.cloudIndicator) DOM.cloudIndicator.classList.remove('hidden');

    // Periksa apakah admin masih menggunakan kata sandi bawaan
    const isUsingDefaultPwd = state.getAdminPassword() === DEFAULT_ADMIN_PASSWORD;
    if (isUsingDefaultPwd) {
      DOM.bannerSecurityWarning.classList.remove('hidden');
      DOM.btnBannerQuickChangePwd.classList.remove('hidden');
    } else {
      DOM.bannerSecurityWarning.classList.add('hidden');
      DOM.btnBannerQuickChangePwd.classList.add('hidden');
    }

    DOM.authBtnLabel.textContent = 'Keluar Admin';
    DOM.authIcon.innerHTML = `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>`;
    DOM.btnAdminAuth.classList.add('btn-secondary');
    DOM.btnAdminAuth.classList.remove('btn-ghost');
  } else {
    // Mode Pengunjung Biasa
    DOM.roleIndicator.classList.remove('is-admin');
    DOM.roleText.textContent = 'Mode Pengunjung';
    DOM.adminQuickActions.classList.add('hidden');
    DOM.adminBanner.classList.add('hidden');
    DOM.bannerSecurityWarning.classList.add('hidden');
    DOM.btnBannerQuickChangePwd.classList.add('hidden');
    if (DOM.cloudIndicator) DOM.cloudIndicator.classList.add('hidden');

    DOM.authBtnLabel.textContent = 'Masuk Admin';
    DOM.authIcon.innerHTML = `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>`;
    DOM.btnAdminAuth.classList.remove('btn-secondary');
    DOM.btnAdminAuth.classList.add('btn-ghost');
  }

  renderLinks();
  updateStats();
}

function handleAuthButtonClick() {
  if (state.isAdmin) {
    // Logout Admin
    state.setAdminStatus(false);
    updateRoleUI();
    showToast('Anda telah keluar dari mode administrator.', 'info');
  } else {
    // Buka Modal Login
    DOM.adminPasswordInput.value = '';
    DOM.authErrorMsg.classList.add('hidden');
    openModal(DOM.modalAdminAuth);
    DOM.adminPasswordInput.focus();
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const enteredPassword = DOM.adminPasswordInput.value.trim();
  const submitBtn = DOM.adminLoginForm ? DOM.adminLoginForm.querySelector('button[type="submit"]') : null;
  const originalText = submitBtn ? submitBtn.innerHTML : '';

  try {
    // Ambil sandi terbaru dari cloud Firestore jika terhubung agar perangkat baru langsung sinkron
    if (FirebaseService.isInitialized && FirebaseService.db) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Memverifikasi...</span>';
      }
      const cloudAuth = await FirebaseService.getCloudPasswordDoc();
      if (cloudAuth && cloudAuth.adminPassword) {
        state.setAdminPasswordLocal(cloudAuth.adminPassword);
      }
    }
  } catch (err) {
    console.warn('Gagal cek sandi cloud saat login:', err);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  const correctPassword = state.getAdminPassword();

  if (enteredPassword === correctPassword) {
    state.setAdminStatus(true);
    closeModal(DOM.modalAdminAuth);
    updateRoleUI();
    showToast('Berhasil masuk! Anda sekarang dapat menambah dan mengelola link.', 'success');
  } else {
    DOM.authErrorMsg.classList.remove('hidden');
    DOM.adminPasswordInput.focus();
    DOM.adminPasswordInput.select();
  }
}

/* ===================================================================
   MODAL HANDLERS
   =================================================================== */
function openModal(modalEl) {
  modalEl.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  modalEl.classList.add('hidden');
  document.body.style.overflow = '';
}

// Menutup modal ketika klik di area luar (overlay)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
    }
  });
});

/* ===================================================================
   RENDER STATISTIK
   =================================================================== */
function updateStats() {
  // Hanya hitung link yang tampil untuk pengunjung jika non-admin
  const visibleLinks = state.isAdmin
    ? state.links
    : state.links.filter(l => l.isVisible !== false);

  DOM.totalLinksCount.textContent = visibleLinks.length;
  DOM.totalCategoriesCount.textContent = state.categories.length;

  const totalClicks = visibleLinks.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  DOM.totalClicksCount.textContent = totalClicks.toLocaleString('id-ID');
}

/* ===================================================================
   RENDER FILTER KATEGORI & SORTING
   =================================================================== */
function renderCategoryFilterPills() {
  DOM.categoriesFilterBar.innerHTML = '';

  const allCategories = ['Semua', ...state.categories];

  allCategories.forEach(catName => {
    const pill = document.createElement('button');
    pill.className = `cat-pill ${catName === state.currentCategory ? 'active' : ''}`;
    pill.textContent = catName;
    pill.addEventListener('click', () => {
      state.currentCategory = catName;
      renderCategoryFilterPills();
      renderLinks();
    });
    DOM.categoriesFilterBar.appendChild(pill);
  });

  // Perbarui juga pilihan di form editor link
  populateCategorySelect();
}

function populateCategorySelect() {
  DOM.linkCategorySelect.innerHTML = '';
  state.categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    DOM.linkCategorySelect.appendChild(opt);
  });
}

/* ===================================================================
   RENDER GRID TAUTAN
   =================================================================== */
function renderLinks() {
  DOM.linksGrid.innerHTML = '';

  // 1. Saring berdasarkan visibilitas (pengunjung hanya melihat isVisible: true)
  let displayed = state.isAdmin
    ? [...state.links]
    : state.links.filter(link => link.isVisible !== false);

  // 2. Saring berdasarkan Kategori
  if (state.currentCategory !== 'Semua') {
    displayed = displayed.filter(link => link.category === state.currentCategory);
  }

  // 3. Saring berdasarkan Kata Kunci Pencarian
  const query = state.searchQuery.toLowerCase().trim();
  if (query) {
    displayed = displayed.filter(link =>
      (link.title && link.title.toLowerCase().includes(query)) ||
      (link.description && link.description.toLowerCase().includes(query)) ||
      (link.url && link.url.toLowerCase().includes(query)) ||
      (link.category && link.category.toLowerCase().includes(query))
    );
  }

  // 4. Urutkan Tautan (Sorting)
  displayed.sort((a, b) => {
    // Pinned selalu paling depan jika mode pinned atau default
    if (state.currentSort === 'pinned') {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    }
    if (state.currentSort === 'popular') {
      return (b.clicks || 0) - (a.clicks || 0);
    }
    if (state.currentSort === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    // Default 'newest': pinned tetap dapat prioritas di atas
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  // Tampilkan Empty State jika tidak ada link
  if (displayed.length === 0) {
    DOM.emptyState.classList.remove('hidden');
    if (query) {
      DOM.emptyTitle.textContent = `Tidak Ada Hasil untuk "${query}"`;
      DOM.emptyDescription.textContent = 'Pastikan ejaan kata kunci benar atau gunakan filter kategori lainnya.';
      DOM.btnEmptyAdd.classList.add('hidden');
    } else {
      DOM.emptyTitle.textContent = 'Belum Ada Tautan di Kategori Ini';
      DOM.emptyDescription.textContent = state.isAdmin
        ? 'Sebagai admin, Anda dapat mulai menambahkan tautan tampilan sekarang.'
        : 'Silakan hubungi administrator untuk menambahkan tautan ke dashboard ini.';
      if (state.isAdmin) {
        DOM.btnEmptyAdd.classList.remove('hidden');
      } else {
        DOM.btnEmptyAdd.classList.add('hidden');
      }
    }
    return;
  }

  DOM.emptyState.classList.add('hidden');

  // Render Kartu Tautan
  displayed.forEach(link => {
    const card = createLinkCardElement(link);
    DOM.linksGrid.appendChild(card);
  });
}

function getCardIconContent(link) {
  // Cek apakah menggunakan preset icon atau auto favicon
  if (link.iconType === 'preset-server') return ICONS.server;
  if (link.iconType === 'preset-code') return ICONS.code;
  if (link.iconType === 'preset-document') return ICONS.document;
  if (link.iconType === 'preset-analytics') return ICONS.analytics;
  if (link.iconType === 'preset-shield') return ICONS.shield;
  if (link.iconType === 'preset-chat') return ICONS.chat;
  if (link.iconType === 'preset-external') return ICONS.external;

  // Mode Auto: Ambil Favicon dari Google favicon service
  try {
    const domain = new URL(link.url).hostname;
    return `<img src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" alt="icon" onerror="this.onerror=null; this.parentElement.innerHTML='${escapeHtml(ICONS.external)}'">`;
  } catch (e) {
    return ICONS.external;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cleanUrlDisplay(rawUrl) {
  try {
    const u = new URL(rawUrl);
    return u.hostname + (u.pathname !== '/' ? u.pathname : '');
  } catch (e) {
    return rawUrl;
  }
}

function createLinkCardElement(link) {
  const card = document.createElement('article');
  card.className = `link-card accent-${link.badgeColor || 'blue'} ${link.isPinned ? 'is-pinned' : ''} ${link.isVisible === false ? 'is-draft' : ''}`;
  card.id = `link-card-${link.id}`;

  const iconHtml = getCardIconContent(link);
  const cleanUrl = cleanUrlDisplay(link.url);

  let badgesHtml = `<span class="card-category-badge">${escapeHtml(link.category)}</span>`;
  if (link.isPinned) {
    badgesHtml += `<span class="card-pin-badge">${ICONS.pin} Disematkan</span>`;
  }
  if (link.isVisible === false) {
    badgesHtml += `<span class="card-draft-badge">Draft (Tersembunyi)</span>`;
  }

  // Bilah Aksi Khusus Admin
  let adminBarHtml = '';
  if (state.isAdmin) {
    adminBarHtml = `
      <div class="card-admin-bar">
        <span class="card-admin-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Kontrol Admin:
        </span>
        <div class="card-admin-btns">
          <button class="btn-admin-action" data-action="toggle-pin" data-id="${link.id}" title="${link.isPinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}">
            ${link.isPinned ? 'Unpin' : 'Pin'}
          </button>
          <button class="btn-admin-action" data-action="toggle-visibility" data-id="${link.id}" title="${link.isVisible === false ? 'Tampilkan ke Publik' : 'Sembunyikan dari Publik'}">
            ${link.isVisible === false ? 'Tampilkan' : 'Sembunyikan'}
          </button>
          <button class="btn-admin-action" data-action="edit" data-id="${link.id}" title="Edit Tautan">
            ${ICONS.edit} Edit
          </button>
          <button class="btn-admin-action danger" data-action="delete" data-id="${link.id}" title="Hapus Tautan">
            ${ICONS.trash} Hapus
          </button>
        </div>
      </div>
    `;
  }

  // Teks preview URL dan tombol salin hanya tampil untuk Admin.
  // Saat mode pengunjung, teks link dihilangkan dan pengunjung cukup melihat tombol "Buka Link" saja.
  const urlPreviewHtml = state.isAdmin ? `
    <div class="card-url-preview">
      ${ICONS.external}
      <span>${escapeHtml(cleanUrl)}</span>
    </div>
  ` : '';

  const copyBtnHtml = state.isAdmin ? `
    <button class="btn-icon-action" data-action="copy" data-url="${escapeHtml(link.url)}" title="Salin Alamat Tautan">
      ${ICONS.copy}
    </button>
  ` : '';

  card.innerHTML = `
    <div>
      <div class="card-top">
        <div class="card-icon-box">
          ${iconHtml}
        </div>
        <div class="card-heading">
          <div class="card-badges-row">
            ${badgesHtml}
          </div>
          <h3 class="card-title">${escapeHtml(link.title)}</h3>
        </div>
      </div>

      <div class="card-body">
        <p class="card-desc">${escapeHtml(link.description || 'Tidak ada deskripsi tambahan.')}</p>
        ${urlPreviewHtml}
      </div>
    </div>

    <div class="card-footer">
      <div class="card-public-bar">
        <div class="card-clicks-count" title="Jumlah kali tautan ini dibuka">
          ${ICONS.eye}
          <span><strong id="clicks-val-${link.id}">${link.clicks || 0}</strong> klik</span>
        </div>

        <div class="card-btn-group">
          ${copyBtnHtml}
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="btn-open-link" data-action="open-link" data-id="${link.id}">
            <span>Buka Link</span>
            ${ICONS.external}
          </a>
        </div>
      </div>

      ${adminBarHtml}
    </div>
  `;

  // Attach Event Listener ke Tombol di dalam kartu
  attachCardEvents(card, link);

  return card;
}

function attachCardEvents(card, link) {
  // 1. Klik Buka Link (Track Click Counter)
  const openBtn = card.querySelector('[data-action="open-link"]');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      link.clicks = (link.clicks || 0) + 1;
      state.saveLinks();
      FirebaseService.recordClick(link.id);
      const clickEl = document.getElementById(`clicks-val-${link.id}`);
      if (clickEl) clickEl.textContent = link.clicks;
      updateStats();
    });
  }

  // 2. Salin URL
  const copyBtn = card.querySelector('[data-action="copy"]');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(link.url)
        .then(() => showToast('Tautan berhasil disalin ke clipboard!', 'success'))
        .catch(() => showToast('Gagal menyalin tautan.', 'error'));
    });
  }

  // 3. Admin Aksi: Edit
  const editBtn = card.querySelector('[data-action="edit"]');
  if (editBtn) {
    editBtn.addEventListener('click', () => openEditLinkModal(link.id));
  }

  // 4. Admin Aksi: Delete
  const delBtn = card.querySelector('[data-action="delete"]');
  if (delBtn) {
    delBtn.addEventListener('click', () => handleDeleteLink(link.id, link.title));
  }

  // 5. Admin Aksi: Toggle Pin
  const pinBtn = card.querySelector('[data-action="toggle-pin"]');
  if (pinBtn) {
    pinBtn.addEventListener('click', () => {
      link.isPinned = !link.isPinned;
      state.saveLinks();
      FirebaseService.updateLinkField(link.id, { isPinned: link.isPinned }).catch(e => console.warn(e));
      renderLinks();
      showToast(`Tautan "${link.title}" ${link.isPinned ? 'disematkan di atas' : 'dilepas dari sematan'}.`, 'info');
    });
  }

  // 6. Admin Aksi: Toggle Visibility
  const visBtn = card.querySelector('[data-action="toggle-visibility"]');
  if (visBtn) {
    visBtn.addEventListener('click', () => {
      link.isVisible = link.isVisible === false ? true : false;
      state.saveLinks();
      FirebaseService.updateLinkField(link.id, { isVisible: link.isVisible }).catch(e => console.warn(e));
      renderLinks();
      updateStats();
      showToast(`Tautan "${link.title}" sekarang ${link.isVisible ? 'dapat dilihat pengunjung' : 'disembunyikan (draft)'}.`, 'info');
    });
  }
}

/* ===================================================================
   ADMIN CRUD LINK (TAMBAH & EDIT)
   =================================================================== */
function openAddLinkModal() {
  if (!state.isAdmin) {
    showToast('Akses ditolak: Hanya admin yang dapat menambah tautan.', 'error');
    return;
  }

  DOM.linkForm.reset();
  DOM.linkIdInput.value = '';
  DOM.linkModalTitle.textContent = 'Tambah Tautan Baru';
  DOM.linkModalSubtitle.textContent = 'Tautan ini akan langsung muncul pada dashboard pengunjung';
  DOM.btnSaveLinkText.textContent = 'Simpan Tautan Baru';
  DOM.linkIsVisible.checked = true;
  DOM.linkIsPinned.checked = false;

  populateCategorySelect();
  openModal(DOM.modalLinkEditor);
  DOM.linkTitleInput.focus();
}

function openEditLinkModal(linkId) {
  if (!state.isAdmin) {
    showToast('Akses ditolak: Hanya admin yang dapat mengedit tautan.', 'error');
    return;
  }

  const link = state.links.find(l => l.id === linkId);
  if (!link) return;

  populateCategorySelect();

  DOM.linkIdInput.value = link.id;
  DOM.linkTitleInput.value = link.title;
  DOM.linkCategorySelect.value = link.category;
  DOM.linkUrlInput.value = link.url;
  DOM.linkDescriptionInput.value = link.description || '';
  DOM.linkIconTypeSelect.value = link.iconType || 'auto';
  DOM.linkBadgeColor.value = link.badgeColor || 'blue';
  DOM.linkIsPinned.checked = !!link.isPinned;
  DOM.linkIsVisible.checked = link.isVisible !== false;

  DOM.linkModalTitle.textContent = 'Sunting Tautan';
  DOM.linkModalSubtitle.textContent = `Memperbarui data tautan: ${link.title}`;
  DOM.btnSaveLinkText.textContent = 'Perbarui Tautan';

  openModal(DOM.modalLinkEditor);
  DOM.linkTitleInput.focus();
}

function handleSaveLinkSubmit(e) {
  e.preventDefault();

  if (!state.isAdmin) {
    showToast('Akses ditolak: Hanya admin yang memiliki hak menyimpan.', 'error');
    return;
  }

  const id = DOM.linkIdInput.value.trim();
  const title = DOM.linkTitleInput.value.trim();
  const category = DOM.linkCategorySelect.value;
  let url = DOM.linkUrlInput.value.trim();
  const description = DOM.linkDescriptionInput.value.trim();
  const iconType = DOM.linkIconTypeSelect.value;
  const badgeColor = DOM.linkBadgeColor.value;
  const isPinned = DOM.linkIsPinned.checked;
  const isVisible = DOM.linkIsVisible.checked;

  if (!title || !url || !category) {
    showToast('Mohon lengkapi semua bidang yang wajib diisi (*).', 'error');
    return;
  }

  // Validasi URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  if (id) {
    // Mode Update
    const index = state.links.findIndex(l => l.id === id);
    if (index !== -1) {
      state.links[index] = {
        ...state.links[index],
        title,
        category,
        url,
        description,
        iconType,
        badgeColor,
        isPinned,
        isVisible,
        updatedAt: Date.now()
      };
      state.saveLinks();
      if (FirebaseService.isInitialized && FirebaseService.db) {
        FirebaseService.saveLink(state.links[index])
          .then(() => showToast(`Tautan "${title}" berhasil diperbarui di Cloud!`, 'success'))
          .catch(err => {
            console.error('Gagal sync ke Firebase:', err);
            alert(`PERINGATAN FIREBASE:\n\nTautan gagal diperbarui di Cloud Database.\nPenyebab: "${err.message}"\n\nPastikan di Firebase Console > Firestore Database > Aturan (Rules) sudah diubah menjadi:\nallow read, write: if true;\ndan tombol "Publikasikan" sudah diklik.`);
          });
      } else {
        showToast(`Tautan "${title}" berhasil diperbarui (Mode Lokal)!`, 'success');
      }
    }
  } else {
    // Mode Tambah Baru
    const newLink = {
      id: 'link-' + Date.now(),
      title,
      category,
      url,
      description,
      iconType,
      badgeColor,
      clicks: 0,
      isPinned,
      isVisible,
      createdAt: Date.now()
    };
    state.links.unshift(newLink);
    state.saveLinks();
    if (FirebaseService.isInitialized && FirebaseService.db) {
      FirebaseService.saveLink(newLink)
        .then(() => showToast(`Tautan "${title}" berhasil ditambahkan ke Cloud!`, 'success'))
        .catch(err => {
          console.error('Gagal sync ke Firebase:', err);
          alert(`PERINGATAN FIREBASE:\n\nTautan "${title}" gagal disimpan ke Cloud Database.\nPenyebab: "${err.message}"\n\nPastikan di Firebase Console > Firestore Database > Aturan (Rules) sudah diubah menjadi:\nallow read, write: if true;\ndan tombol "Publikasikan" sudah diklik.`);
        });
    } else {
      showToast(`Tautan "${title}" berhasil ditambahkan ke dashboard!`, 'success');
    }
  }

  closeModal(DOM.modalLinkEditor);
  state.currentCategory = 'Semua';
  state.searchQuery = '';
  if (DOM.searchInput) DOM.searchInput.value = '';
  renderCategoryFilterPills();
  renderLinks();
  updateStats();
}

async function handleDeleteLink(linkId, title) {
  if (!state.isAdmin) {
    showToast('Akses ditolak: Hanya admin yang dapat menghapus tautan.', 'error');
    return;
  }

  const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus tautan "${title}" secara permanen?`);
  if (!confirmDelete) return;

  const previousLinks = [...state.links];
  state.links = state.links.filter(l => l.id !== linkId);
  state.saveLinks();
  renderLinks();
  updateStats();

  if (FirebaseService.isInitialized && FirebaseService.isConnected) {
    try {
      await FirebaseService.deleteLink(linkId);
      showToast(`Tautan "${title}" berhasil dihapus dari Cloud Database.`, 'info');
    } catch (err) {
      console.error('Gagal delete dari Firebase:', err);
      // Revert data jika server Firebase menolak penghapusan (misal karena Rules belum diizinkan)
      state.links = previousLinks;
      state.saveLinks();
      renderLinks();
      updateStats();
      showToast(`Gagal menghapus dari Cloud: ${err.message}. Pastikan izin di tab Aturan (Rules) Firebase bernilai true!`, 'error');
    }
  } else {
    showToast(`Tautan "${title}" berhasil dihapus (Mode Lokal).`, 'info');
  }
}

/* ===================================================================
   ADMIN MANAJEMEN KATEGORI
   =================================================================== */
function openCategoryManagerModal() {
  if (!state.isAdmin) {
    showToast('Akses ditolak: Hanya admin yang dapat mengelola kategori.', 'error');
    return;
  }
  renderCategoryManagerList();
  openModal(DOM.modalCategoryManager);
  DOM.newCategoryName.focus();
}

function renderCategoryManagerList() {
  DOM.categoryItemsList.innerHTML = '';

  state.categories.forEach(cat => {
    const count = state.links.filter(l => l.category === cat).length;
    const li = document.createElement('li');
    li.className = 'category-item';
    li.innerHTML = `
      <span class="category-item-name">${escapeHtml(cat)}</span>
      <span class="category-item-count">${count} tautan</span>
      <button class="btn-delete-cat" title="Hapus Kategori" data-cat="${escapeHtml(cat)}">
        ${ICONS.trash}
      </button>
    `;

    li.querySelector('.btn-delete-cat').addEventListener('click', () => {
      handleDeleteCategory(cat, count);
    });

    DOM.categoryItemsList.appendChild(li);
  });
}

function handleAddCategory(e) {
  e.preventDefault();
  const name = DOM.newCategoryName.value.trim();
  if (!name) return;

  if (state.categories.includes(name)) {
    showToast('Kategori ini sudah terdaftar.', 'error');
    return;
  }

  state.categories.push(name);
  state.saveCategories();
  DOM.newCategoryName.value = '';
  renderCategoryManagerList();
  renderCategoryFilterPills();
  updateStats();
  showToast(`Kategori "${name}" berhasil ditambahkan!`, 'success');
}

function handleDeleteCategory(catName, count) {
  if (state.categories.length <= 1) {
    showToast('Minimal harus ada satu kategori dalam sistem.', 'error');
    return;
  }

  if (count > 0) {
    const proceed = confirm(`Kategori "${catName}" masih memiliki ${count} tautan. Tautan tersebut akan dialihkan ke kategori "${state.categories[0]}". Lanjutkan?`);
    if (!proceed) return;

    // Alihkan link ke kategori pertama yang tersisa
    state.links.forEach(l => {
      if (l.category === catName) {
        l.category = state.categories[0];
      }
    });
    state.saveLinks();
  }

  state.categories = state.categories.filter(c => c !== catName);
  state.saveCategories();

  if (state.currentCategory === catName) {
    state.currentCategory = 'Semua';
  }

  renderCategoryManagerList();
  renderCategoryFilterPills();
  renderLinks();
  updateStats();
  showToast(`Kategori "${catName}" berhasil dihapus.`, 'info');
}

/* ===================================================================
   ADMIN MANAJEMEN DATA (BACKUP & RESTORE JSON)
   =================================================================== */
function openDataManagerModal() {
  if (!state.isAdmin) {
    showToast('Akses ditolak: Hanya admin yang dapat mengelola data cadangan.', 'error');
    return;
  }
  openModal(DOM.modalDataManager);
}

function handleExportBackup() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    system: 'NexusLink Hub',
    version: '1.0.0',
    categories: state.categories,
    links: state.links
  };

  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", `nexuslink_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Cadangan data tautan berhasil diunduh (JSON)!', 'success');
}

function handleImportBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const data = JSON.parse(event.target.result);
      if (Array.isArray(data.links) && Array.isArray(data.categories)) {
        state.links = data.links;
        state.categories = data.categories;
        state.saveLinks();
        state.saveCategories();
        renderCategoryFilterPills();
        renderLinks();
        updateStats();
        closeModal(DOM.modalDataManager);
        showToast('Data cadangan berhasil diimpor ke dashboard!', 'success');
      } else {
        showToast('Format file JSON tidak sesuai dengan skema NexusLink.', 'error');
      }
    } catch (err) {
      showToast('Gagal membaca file JSON cadangan: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = ''; // Reset input file
}

function handleResetDefaultData() {
  const confirmReset = confirm('Peringatan: Seluruh data tautan dan kategori saat ini akan digantikan dengan data sampel bawaan. Lanjutkan?');
  if (!confirmReset) return;

  state.links = [...INITIAL_LINKS];
  state.categories = [...INITIAL_CATEGORIES];
  state.currentCategory = 'Semua';
  state.saveLinks();
  state.saveCategories();

  renderCategoryFilterPills();
  renderLinks();
  updateStats();
  closeModal(DOM.modalDataManager);
  showToast('Data berhasil diatur ulang ke sampel bawaan.', 'info');
}

/* ===================================================================
   ADMIN PENGATURAN KATA SANDI
   =================================================================== */
function openChangePasswordModal() {
  if (!state.isAdmin) {
    showToast('Akses ditolak: Hanya admin yang dapat mengubah kata sandi.', 'error');
    return;
  }
  DOM.changePasswordForm.reset();
  DOM.changePwdErrorMsg.classList.add('hidden');
  DOM.changePwdErrorMsg.textContent = '';
  openModal(DOM.modalChangePassword);
  DOM.currentPasswordInput.focus();
}

async function handleChangePasswordSubmit(e) {
  e.preventDefault();

  if (!state.isAdmin) {
    showToast('Akses ditolak: Anda harus login sebagai admin.', 'error');
    return;
  }

  const currentPwd = DOM.currentPasswordInput.value.trim();
  const newPwd = DOM.newPasswordInput.value.trim();
  const confirmPwd = DOM.confirmNewPasswordInput.value.trim();

  // 1. Validasi kata sandi saat ini
  if (currentPwd !== state.getAdminPassword()) {
    showChangePwdError('Kata sandi saat ini tidak sesuai. Silakan periksa kembali.');
    DOM.currentPasswordInput.focus();
    DOM.currentPasswordInput.select();
    return;
  }

  // 2. Validasi panjang kata sandi baru
  if (newPwd.length < 6) {
    showChangePwdError('Kata sandi baru harus memiliki panjang minimal 6 karakter.');
    DOM.newPasswordInput.focus();
    return;
  }

  // 3. Validasi kesamaan kata sandi baru dengan konfirmasi
  if (newPwd !== confirmPwd) {
    showChangePwdError('Konfirmasi kata sandi baru tidak cocok. Harap ketik ulang.');
    DOM.confirmNewPasswordInput.focus();
    return;
  }

  // 4. Pastikan kata sandi baru tidak sama persis dengan bawaan
  if (newPwd === DEFAULT_ADMIN_PASSWORD) {
    showChangePwdError('Kata sandi baru tidak boleh sama dengan kata sandi bawaan (admin123). Buatlah sandi yang lebih unik.');
    DOM.newPasswordInput.focus();
    return;
  }

  const saveBtn = DOM.changePasswordForm.querySelector('button[type="submit"]');
  const originalSaveText = saveBtn ? saveBtn.innerHTML : '';

  try {
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span>Menyimpan ke Cloud...</span>';
    }

    // Simpan kata sandi baru ke storage lokal & Cloud Firestore
    await state.setAdminPassword(newPwd);
    closeModal(DOM.modalChangePassword);
    updateRoleUI();
    showToast('Kata sandi admin berhasil diperbarui dan disinkronkan ke seluruh perangkat (HP & Laptop)!', 'success');
  } catch (err) {
    console.error('Gagal menyimpan kata sandi ke cloud:', err);
    showChangePwdError('Gagal menyinkronkan ke Cloud: ' + (err.message || 'Periksa koneksi internet'));
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalSaveText;
    }
  }
}

function showChangePwdError(message) {
  DOM.changePwdErrorMsg.textContent = message;
  DOM.changePwdErrorMsg.classList.remove('hidden');
}

/* ===================================================================
   MODAL KONFIGURASI CLOUD FIREBASE
   =================================================================== */
function openCloudModal() {
  const currentConfig = FirebaseService.getConfig();
  if (currentConfig) {
    DOM.firebaseConfigInput.value = JSON.stringify(currentConfig, null, 2);
  } else {
    DOM.firebaseConfigInput.value = '';
  }

  openModal(DOM.modalCloudConfig);
}

function parseFirebaseConfigInput(text) {
  if (!text || !text.trim()) return null;

  const raw = text.trim();

  // 1. Coba parse sebagai JSON langsung
  try {
    const obj = JSON.parse(raw);
    if (obj.apiKey) return obj;
  } catch (e) { }

  // 2. Ekstrak properti menggunakan regex jika user menempel potongan JS (misal const firebaseConfig = { ... })
  const extract = (key) => {
    const regex = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]([^'"]+)['"]`, 'i');
    const match = raw.match(regex);
    return match ? match[1] : '';
  };

  const apiKey = extract('apiKey');
  const authDomain = extract('authDomain');
  const projectId = extract('projectId');
  const storageBucket = extract('storageBucket');
  const messagingSenderId = extract('messagingSenderId');
  const appId = extract('appId') || extract('ID aplikasi');
  const measurementId = extract('measurementId') || extract('ID pengukuran');

  if (apiKey && projectId) {
    const res = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId
    };
    if (measurementId) res.measurementId = measurementId;
    return res;
  }

  return null;
}

function handleSaveCloudConfig(e) {
  e.preventDefault();

  const text = DOM.firebaseConfigInput.value.trim();
  if (!text) {
    // Reset/Hapus konfigurasi kustom
    localStorage.removeItem(STORAGE_KEYS.FIREBASE_CUSTOM);
    showToast('Konfigurasi kustom dihapus. Kembali ke mode lokal.', 'info');
    FirebaseService.init();
    closeModal(DOM.modalCloudConfig);
    return;
  }

  const parsed = parseFirebaseConfigInput(text);
  if (!parsed || !parsed.apiKey || !parsed.projectId) {
    showToast('Format konfigurasi tidak valid. Pastikan mengandung apiKey dan projectId.', 'error');
    return;
  }

  // Simpan ke localStorage untuk pengujian instan di peramban ini
  localStorage.setItem(STORAGE_KEYS.FIREBASE_CUSTOM, JSON.stringify(parsed));
  showToast('Konfigurasi berhasil disimpan! Menyambungkan ke Cloud...', 'success');

  // Re-inisialisasi Firebase
  FirebaseService.init();
}

function handleCopyFileConfig() {
  const text = DOM.firebaseConfigInput.value.trim();
  const config = parseFirebaseConfigInput(text) || FirebaseService.getConfig();

  if (!config) {
    showToast('Mohon masukkan atau tempel konfigurasi Firebase terlebih dahulu.', 'error');
    return;
  }

  const fileContent = `/**
 * ===================================================================
 * NEXUSLINK HUB - KONFIGURASI DATABASE CLOUD (FIREBASE FIRESTORE)
 * ===================================================================
 */

const FIREBASE_CONFIG = ${JSON.stringify(config, null, 2)};
`;

  navigator.clipboard.writeText(fileContent)
    .then(() => showToast('Kode disalin! Tempelkan ke berkas firebase-config.js di laptop Anda.', 'success'))
    .catch(() => showToast('Gagal menyalin ke clipboard.', 'error'));
}

async function handleSeedCloudData() {
  if (!FirebaseService.isConnected) {
    showToast('Cloud belum terhubung. Pastikan konfigurasi Firebase valid.', 'error');
    return;
  }

  const confirmSeed = confirm('Unggah seluruh tautan demo bawaan ke Firebase Cloud? Data di cloud akan diperbarui.');
  if (!confirmSeed) return;

  try {
    await FirebaseService.seedDefaults();
    showToast('Berhasil mengunggah seluruh data demo ke Firebase Cloud!', 'success');
  } catch (err) {
    showToast(`Gagal mengunggah data: ${err.message}`, 'error');
  }
}

/* ===================================================================
   EVENT LISTENERS INITIALIZATION
   =================================================================== */
function initEventListeners() {
  // 1. Auth & Admin Toggle
  DOM.btnAdminAuth.addEventListener('click', handleAuthButtonClick);
  if (DOM.btnLockedLogin) {
    DOM.btnLockedLogin.addEventListener('click', handleAuthButtonClick);
  }
  DOM.adminLoginForm.addEventListener('submit', handleLoginSubmit);
  DOM.btnCloseAuthModal.addEventListener('click', () => closeModal(DOM.modalAdminAuth));
  DOM.btnCancelAuth.addEventListener('click', () => closeModal(DOM.modalAdminAuth));
  DOM.btnCloseBanner.addEventListener('click', () => DOM.adminBanner.classList.add('hidden'));

  // Toggle Password Visibility
  DOM.btnTogglePwd.addEventListener('click', () => {
    const isPassword = DOM.adminPasswordInput.type === 'password';
    DOM.adminPasswordInput.type = isPassword ? 'text' : 'password';
  });

  // 2. Open Modal Actions (Admin Only)
  DOM.btnOpenAddModal.addEventListener('click', openAddLinkModal);
  DOM.btnEmptyAdd.addEventListener('click', openAddLinkModal);
  DOM.btnOpenManageCategories.addEventListener('click', openCategoryManagerModal);
  DOM.btnOpenDataManagement.addEventListener('click', openDataManagerModal);
  DOM.btnOpenChangePassword.addEventListener('click', openChangePasswordModal);
  DOM.btnBannerQuickChangePwd.addEventListener('click', openChangePasswordModal);

  // 3. Link Editor Modal
  DOM.linkForm.addEventListener('submit', handleSaveLinkSubmit);
  DOM.btnCloseLinkModal.addEventListener('click', () => closeModal(DOM.modalLinkEditor));
  DOM.btnCancelLinkModal.addEventListener('click', () => closeModal(DOM.modalLinkEditor));

  // 4. Category Modal
  DOM.addCategoryForm.addEventListener('submit', handleAddCategory);
  DOM.btnCloseCatModal.addEventListener('click', () => closeModal(DOM.modalCategoryManager));
  DOM.btnCloseCatModalBottom.addEventListener('click', () => closeModal(DOM.modalCategoryManager));

  // 5. Data Modal
  DOM.btnExportData.addEventListener('click', handleExportBackup);
  DOM.importFileInput.addEventListener('change', handleImportBackup);
  DOM.btnResetDefaultData.addEventListener('click', handleResetDefaultData);
  DOM.btnCloseDataModal.addEventListener('click', () => closeModal(DOM.modalDataManager));
  DOM.btnCloseDataModalBottom.addEventListener('click', () => closeModal(DOM.modalDataManager));

  // 6. Change Password Modal
  DOM.changePasswordForm.addEventListener('submit', handleChangePasswordSubmit);
  DOM.btnCloseChangePwdModal.addEventListener('click', () => closeModal(DOM.modalChangePassword));
  DOM.btnCancelChangePwd.addEventListener('click', () => closeModal(DOM.modalChangePassword));

  DOM.btnToggleCurrentPwd.addEventListener('click', () => {
    const isPwd = DOM.currentPasswordInput.type === 'password';
    DOM.currentPasswordInput.type = isPwd ? 'text' : 'password';
  });
  DOM.btnToggleNewPwd.addEventListener('click', () => {
    const isPwd = DOM.newPasswordInput.type === 'password';
    DOM.newPasswordInput.type = isPwd ? 'text' : 'password';
  });

  // 6. Search & Sorting
  DOM.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery) {
      DOM.btnClearSearch.classList.remove('hidden');
    } else {
      DOM.btnClearSearch.classList.add('hidden');
    }
    renderLinks();
  });

  DOM.btnClearSearch.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.searchQuery = '';
    DOM.btnClearSearch.classList.add('hidden');
    renderLinks();
    DOM.searchInput.focus();
  });

  DOM.sortSelect.addEventListener('change', (e) => {
    state.currentSort = e.target.value;
    renderLinks();
  });

  // 7. Cloud Firebase Modal
  if (DOM.btnOpenCloudModal) DOM.btnOpenCloudModal.addEventListener('click', openCloudModal);
  if (DOM.cloudIndicator) DOM.cloudIndicator.addEventListener('click', openCloudModal);
  if (DOM.btnCloseCloudModal) DOM.btnCloseCloudModal.addEventListener('click', () => closeModal(DOM.modalCloudConfig));
  if (DOM.cloudConfigForm) DOM.cloudConfigForm.addEventListener('submit', handleSaveCloudConfig);
  if (DOM.btnCopyFileConfig) DOM.btnCopyFileConfig.addEventListener('click', handleCopyFileConfig);
  if (DOM.btnSeedCloudData) DOM.btnSeedCloudData.addEventListener('click', handleSeedCloudData);

  // 8. Shortcut Keyboard ESC untuk menutup modal yang aktif
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
        closeModal(modal);
      });
    }
  });
}

/* ===================================================================
   WIDGET WAKTU DAN TANGGAL REALTIME
   =================================================================== */
function initLiveClock() {
  const dateEl = document.getElementById('clockDate');
  const timeEl = document.getElementById('clockTime');
  if (!dateEl || !timeEl) return;

  const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  function updateClock() {
    const now = new Date();

    const hari = namaHari[now.getDay()];
    const tanggal = now.getDate();
    const bulan = namaBulan[now.getMonth()];
    const tahun = now.getFullYear();

    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const detik = String(now.getSeconds()).padStart(2, '0');

    dateEl.textContent = `${hari}, ${tanggal} ${bulan} ${tahun}`;
    timeEl.textContent = `${jam}:${menit}:${detik} WIB`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ===================================================================
   BOOSTRAP APLIKASI
   =================================================================== */
function initApp() {
  initLiveClock();
  updateRoleUI();
  renderCategoryFilterPills();
  renderLinks();
  updateStats();
  initEventListeners();
  FirebaseService.init();
  console.log('Satu Pintu siap digunakan.');
}

// Jalankan ketika seluruh dokumen telah selesai dimuat
document.addEventListener('DOMContentLoaded', initApp);

