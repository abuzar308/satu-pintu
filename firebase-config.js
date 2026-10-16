/**
 * ===================================================================
 * NEXUSLINK HUB - KONFIGURASI DATABASE CLOUD (FIREBASE FIRESTORE)
 * ===================================================================
 * 
 * Agar tautan yang Anda tambahkan/edit langsung tersimpan di Cloud
 * dan otomatis muncul di HP maupun perangkat pengunjung lain secara realtime,
 * masukkan kunci konfigurasi Firebase Anda di bawah ini:
 * 
 * Panduan Singkat Mendapatkan Konfigurasi (Gratis dari Google):
 * 1. Buka https://console.firebase.google.com/
 * 2. Klik "Add project" / "Tambah Proyek" (beri nama bebas, misal: nexuslink-db)
 * 3. Di menu sebelah kiri, pilih "Build" -> "Firestore Database" -> "Create database"
 *    - Pilih mode: "Start in test mode" (agar bisa baca/tulis langsung)
 * 4. Kembali ke "Project Overview" (ikon gerigi / Settings -> Project settings)
 * 5. Di bagian "Your apps", klik ikon Web (</>), beri nama app, lalu salin
 *    objek "firebaseConfig" dan ganti nilainya di bawah ini:
 */

const FIREBASE_CONFIG = {
  apiKey: "ISI_API_KEY_ANDA",
  authDomain: "ISI_AUTH_DOMAIN_ANDA",
  projectId: "ISI_PROJECT_ID_ANDA",
  storageBucket: "ISI_STORAGE_BUCKET_ANDA",
  messagingSenderId: "ISI_MESSAGING_SENDER_ID_ANDA",
  appId: "ISI_APP_ID_ANDA"
};
