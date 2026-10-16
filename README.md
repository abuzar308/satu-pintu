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
- Muncul bilah kontrol admin (**Tambah Link Baru**, **Kelola Kategori**, **Cadangan Data**, dan **Ganti Sandi**).
- Pada setiap kartu tautan muncul tindakan admin: **Pin / Unpin**, **Tampilkan / Sembunyikan (Draft)**, **Edit**, dan **Hapus**.

---

## ✨ Fitur-Fitur Utama

### 1. Bagi Pengunjung (Mode Pengunjung)
- **Tampilan Bersih & Minimalis**: Pengunjung dapat melihat kartu, nama sistem, ikon, kategori, dan deskripsi tautan tanpa teks URL mentah yang terekspos.
- **Akses Langsung**: Pengunjung cukup mengklik tombol **"Buka Link"** untuk langsung menuju ke halaman target.
- **Pencarian & Filter Real-Time**: Mencari tautan dan menyaring berdasarkan kategori tetap dapat digunakan secara interaktif.
- **Widget Tanggal & Jam Realtime**: Menampilkan hari, tanggal, dan jam lokal di bilah atas.

### 2. Khusus Administrator (Kontrol Penuh)
- **Tambah Tautan Baru**:
  - Nama / Judul Tautan.
  - Alamat URL target lengkap (otomatis mendeteksi protokol `https://`).
  - Kategori (pilih yang sudah ada atau buat kategori baru).
  - Deskripsi panduan bagi pengguna.
  - Pilihan ikon (deteksi favicon otomatis dari domain atau pilih ikon preset).
  - Pilihan warna aksen kartu (*Blue, Purple, Emerald, Amber, Rose, Cyan*).
  - Opsi sematkan di atas (*Pin to top*).
  - Opsi visibilitas (*Publik* atau simpan sebagai *Draft/Tersembunyi*).
- **Edit & Perbarui Tautan**: Mengubah data tautan yang sudah ada kapan saja.
- **Hapus Tautan**: Menghapus tautan dengan konfirmasi keamanan.
- **Kelola Kategori**: Menambah kategori baru atau menghapus kategori lama beserta migrasi otomatis tautan terkait.
- **Ubah Kata Sandi Admin**: Mengganti kata sandi bawaan (`admin123`) dengan kata sandi rahasia pilihan Anda sendiri (minimal 6 karakter) agar hak admin tidak dapat disalahgunakan oleh orang lain.
- **Ekspor & Impor Cadangan (JSON)**: Menyimpan seluruh basis data tautan ke berkas JSON di komputer lokal atau memulihkan data dari berkas cadangan.
- **Reset ke Data Sampel**: Opsi memuat kembali data demo awal jika diperlukan.

---

## 📂 Struktur Berkas

```text
d:\Antigravity Ide\
│
├── index.html        # Struktur antarmuka semantik, form modal, dan tata letak
├── styles.css        # Desain visual Glassmorphism, animasi ambient glow & responsivitas
├── app.js            # Logika kontrol akses peran, CRUD link, pencarian, dan penyimpanan lokal
└── README.md         # Dokumentasi panduan penggunaan aplikasi
```

---

## 💾 Penyimpanan Data
Seluruh data tautan, kategori, dan statistik klik disimpan secara persisten di peramban menggunakan `localStorage` peramban web pengguna. Data tidak akan hilang ketika halaman dimuat ulang (*refresh*).
