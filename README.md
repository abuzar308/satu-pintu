# NexusLink Hub - Dashboard Portal Tautan Modern

Aplikasi web dashboard portal tautan (*link management hub*) modern dengan pembatasan hak akses berbasis peran (**Role-Based Access Control**). Pada aplikasi ini, **hanya administrator** yang memiliki wewenang untuk menambahkan, menyunting, mengatur visibilitas, dan menghapus tautan untuk tampilan dashboard. Pengunjung biasa hanya dapat melihat, mencari, memfilter, dan membuka tautan yang telah dipublikasikan.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dibangun menggunakan teknologi murni web (*Vanilla HTML5, CSS3, & Modern JavaScript*) tanpa ketergantungan runtime eksternal.

1. **Buka Berkas**:
   - Cukup klik dua kali pada file [index.html](file:///d:/Antigravity%20Ide/index.html) untuk langsung membukanya di browser apa saja (Google Chrome, Microsoft Edge, Mozilla Firefox, dsb).
2. **Atau Melalui Terminal**:
   - Jika menggunakan Windows PowerShell:
     ```powershell
     Start-Process "d:\Antigravity Ide\index.html"
     ```

---

## 🔐 Kredensial & Akses Administrator

- **Status Awal**: **Mode Pengunjung**. Kartu tautan tampil rapi untuk pengunjung, namun **teks alamat URL target dan tombol salin disembunyikan**—pengunjung cukup menggunakan tombol **"Buka Link"**.
- **Tombol Masuk Admin**: Berada di pojok kanan atas navbar (**"Masuk Admin"**).
- **Kata Sandi Default**:
  ```text
  admin123
  ```

Ketika login sebagai Administrator berhasil:
- Indikator status berubah menjadi **Mode Admin (Aktif)** berwarna hijau.
- Teks alamat URL target dan tombol salin tautan ditampilkan untuk keperluan administrasi.
- Muncul bilah kontrol admin (**Tambah Link Baru**, **Kategori Sistem**, **Cadangan Data**, dan **Ganti Sandi**).
- Pada setiap kartu tautan muncul tindakan admin: **Kunci / Buka Kunci (Lock/Unlock)**, **Pin / Unpin**, **Tampilkan / Sembunyikan (Draft)**, **Edit**, dan **Hapus**.

---

## ✨ Fitur-Fitur Utama

### 1. Bagi Pengunjung (Mode Pengunjung)
- **Tampilan Bersih & Minimalis**: Pengunjung dapat melihat kartu, nama sistem, ikon, kategori, dan deskripsi tautan tanpa teks URL mentah yang terekspos.
- **Akses Tautan Terbuka**: Pengunjung cukup mengklik tombol **"Buka Link"** untuk langsung menuju ke halaman target.
- **Proteksi Tautan Terkunci**: Apabila suatu tautan dikunci oleh admin, tombol akan berubah menjadi **"Terkunci" 🔒** tanpa tautan URL aktif sehingga pengunjung **tidak bisa membuka atau mengklik** tautan tersebut.
- **Pencarian & Filter Real-Time**: Mencari tautan dan menyaring berdasarkan 4 kategori standar: **Pengembangan**, **Operasional**, **Internal HRD**, dan **Media Sosial**.
- **Widget Tanggal & Jam Realtime**: Menampilkan hari, tanggal, dan jam lokal di bilah atas.

### 2. Khusus Administrator (Kontrol Penuh)
- **Kunci / Buka Kunci Tautan (Lock Feature)**:
  - Admin dapat mengunci tautan langsung melalui tombol **"Kunci"** pada bilah kartu atau melalui saklar di formulir editor tautan.
  - Tautan yang dikunci menampilkan badge **Terkunci** dan memblokir akses pengunjung secara instan.
- **Tambah Tautan Baru**:
  - Nama / Judul Tautan.
  - Alamat URL target lengkap (otomatis mendeteksi protokol `https://`).
  - Kategori standar (pilihan khusus: **Pengembangan**, **Operasional**, **Internal HRD**, atau **Media Sosial**).
  - Deskripsi panduan bagi pengguna.
  - Pilihan ikon (deteksi favicon otomatis dari domain atau pilih ikon preset).
  - Pilihan warna aksen kartu (*Blue, Purple, Emerald, Amber, Rose, Cyan*).
  - Opsi sematkan di atas (*Pin to top*).
  - Opsi penguncian tautan (*Kunci Tautan*).
  - Opsi visibilitas (*Publik* atau simpan sebagai *Draft/Tersembunyi*).
- **Edit & Perbarui Tautan**: Mengubah data tautan yang sudah ada kapan saja.
- **Hapus Tautan**: Menghapus tautan dengan konfirmasi keamanan.
- **Kategori Sistem Resmi**: Sistem menggunakan 4 kategori standar (**Pengembangan**, **Operasional**, **Internal HRD**, **Media Sosial**) untuk pengelompokan yang konsisten.
- **Ubah Kata Sandi Admin**: Mengganti kata sandi bawaan (`admin123`) dengan kata sandi rahasia pilihan Anda sendiri (minimal 6 karakter).
- **Ekspor & Impor Cadangan (JSON)**: Menyimpan seluruh basis data tautan ke berkas JSON di komputer lokal atau memulihkan data dari berkas cadangan.
- **Reset ke Data Sampel**: Opsi memuat kembali data demo awal jika diperlukan.

---

## 📂 Struktur Berkas

```text
d:\Antigravity Ide\
│
├── index.html        # Struktur antarmuka semantik, form modal, dan tata letak
├── styles.css        # Desain visual Glassmorphism, animasi ambient glow & responsivitas
├── app.js            # Logika kontrol akses peran, CRUD link, pencarian, dan sinkronisasi Cloud Firestore
├── firebase-config.js# Berkas konfigurasi kunci Cloud Database Firebase
└── README.md         # Dokumentasi panduan penggunaan aplikasi
```

---

## ☁️ Integrasi Database Online (Firebase Firestore)

Aplikasi ini mendukung penyimpanan **Cloud Database Realtime (Firebase Firestore)** secara gratis dari Google, sehingga tautan yang Anda tambah, edit, atau hapus langsung tersinkronisasi ke semua HP dan komputer pengunjung secara otomatis tanpa perlu muat ulang (*refresh*).

### Cara Menghubungkan Firebase:

1. **Buat Database Firestore (Gratis)**:
   - Kunjungi [console.firebase.google.com](https://console.firebase.google.com/) dan buat proyek baru (misal: `nexuslink-hub`).
   - Pilih menu **Build ➔ Firestore Database ➔ Create database** (Pilih mode: *Start in test mode*).
   - Di tab **Rules**, pastikan aturannya mengizinkan baca/tulis:
     ```text
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```
     Klik **Publish**.

2. **Dapatkan Kunci Aplikasi Web**:
   - Klik ikon **Project Settings (Gerigi ⚙️)** ➔ di bagian *Your apps*, pilih ikon Web (`</>`).
   - Daftarkan aplikasi dan salin objek `firebaseConfig`.

3. **Sambungkan ke Aplikasi (Pilih Salah Satu Cara)**:
   - **Cara A (Langsung dari Tampilan Web)**:
     1. Buka [index.html](file:///d:/Antigravity%20Ide/index.html) di peramban.
     2. Klik **"Masuk Admin"** (sandi: `admin123`).
     3. Klik tombol **"Cloud Firebase"** di bilah navigasi atas.
     4. Tempelkan objek konfigurasi ke dalam kotak textarea, lalu klik **"Uji & Hubungkan Sekarang"**.
     5. Klik tombol **"Unggah Data Demo ke Cloud"** untuk mengirimkan data awal ke Firestore.
   - **Cara B (Tersimpan Permanen di Kode)**:
     - Buka berkas [firebase-config.js](file:///d:/Antigravity%20Ide/firebase-config.js) dan tempel nilai konfigurasi Anda. Semua pengunjung yang membuka situs akan langsung otomatis terhubung ke Firestore.

---

## 💾 Mode Penyimpanan Cadangan (Lokal)
Jika Firebase belum dihubungkan, sistem akan otomatis menggunakan `localStorage` peramban web lokal sehingga tautan tetap tersimpan secara aman di perangkat Anda.
