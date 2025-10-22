# 🚀 User Management API

> API Manajemen User sederhana yang dibuat menggunakan [Express](https://expressjs.com/) dengan [PostgreSQL](https://www.postgresql.org/) dan [Cloudinary](https://cloudinary.com/) untuk menyimpan foto/avatar.

Project ini ditujukan untuk menyelesaikan tugas Backend Part 3 di [Celerates](https://celerates.co.id)

## 📋 Daftar Isi

- [Tech Stack](#️-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi & Quick Start](#-instalasi--quick-start)
- [Endpoint API](#-endpoint-api)
- [Dokumentasi Swagger](#-dokumentasi-swagger)
- [Testing dengan Postman](#-testing-dengan-postman)

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| **Node.js** | Runtime environment (ES Modules) |
| **Express** | Web framework |
| **PostgreSQL** | Database (`pg` driver) |
| **Cloudinary** | Hosting gambar & penyimpanan avatar |
| **Multer** | Penanganan upload file multipart |
| **Bcrypt** | Hashing password |
| **JWT** | Token autentikasi |
| **Helmet & CORS** | Keamanan HTTP |

---

## 📋 Prasyarat

- ✅ **Node.js** (>=16)
- ✅ **npm** package manager
- ✅ **PostgreSQL** database
- ✅ **Akun Cloudinary** (untuk hosting gambar)

---

## 🚀 Instalasi & Quick Start

### 📋 Langkah-langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/rizqishq/user_management_api
cd user_management_api

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env dengan kredensial database dan Cloudinary Anda

# 4. Setup database
npm run setup-db

# 5. Jalankan server
npm run dev
```

### ⚙️ Konfigurasi Environment

- **Database**: Pastikan PostgreSQL sudah berjalan dan konfigurasi di `.env` sudah benar
- **Cloudinary**: Dapatkan kredensial dari [Cloudinary Dashboard](https://cloudinary.com/console)
- **JWT Secret**: Buat secret key yang kuat untuk autentikasi

### 🌐 Akses API

Setelah server berjalan, API akan tersedia di:
- **API Base URL**: `http://localhost:5000` (atau port yang dikonfigurasi)
- **Dokumentasi**: `http://localhost:5000/api/docs`

---

## 🔗 Endpoint API

> **Base URL**: `http://localhost:<PORT>` (default: `5000`)

### 🔐 Route Autentikasi (`/api/auth`)

#### `POST /api/auth/register`
- **Akses**: Public
- **Deskripsi**: Mendaftarkan akun pengguna baru
- **Request Body**:
  ```json
  {
      "username": "nama",
      "email": "email",
      "password": "password",
      "confirmPassword": "password"
  }
  ```
- **Response**: Mengembalikan data pengguna yang telah dibuat (tanpa password)

#### `POST /api/auth/login`
- **Akses**: Public
- **Deskripsi**: Login dan mendapatkan JWT token
- **Request Body**:
  ```json
  {
      "email": "email",
      "password": "password"
  }
  ```
- **Response**: `{ token, user }` jika berhasil login

### 👥 Route Pengguna (`/api/users`)

> **⚠️ Semua route membutuhkan autentikasi** (`Authorization: Bearer <token>`)

#### `GET /api/users/`
- **Deskripsi**: Mendapatkan daftar semua pengguna (hanya data publik)
- **Response**: Array objek pengguna

#### `GET /api/users/:id`
- **Deskripsi**: Mendapatkan profil pengguna berdasarkan ID
- **Response**: Objek pengguna tunggal

#### `PUT /api/users/:id`
- **Deskripsi**: Memperbarui profil pengguna (hanya profil sendiri)
- **Otorisasi**: Pengguna hanya dapat memperbarui profil mereka sendiri
- **Request Body** (minimal satu field diperlukan):
  ```json
  {
      "username": "nama_baru",
      "email": "email_baru"
  }
  ```
- **Response**: Data pengguna yang telah diperbarui

#### `POST /api/users/:id/avatar`
- **Deskripsi**: Upload gambar avatar
- **Otorisasi**: Hanya pemilik akun yang dapat upload
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file`
- **Format yang Diterima**: `image/jpeg`, `image/png`, `image/gif`
- **Ukuran Maksimal**: 5 MB
- **Hasil**: Diunggah ke [Cloudinary](https://cloudinary.com) dan memperbarui `avatar_url` di database

#### `DELETE /api/users/:id`
- **Deskripsi**: Menghapus akun pengguna
- **Otorisasi**: Hanya pemilik akun yang dapat menghapus
- **Response**: Data pengguna yang telah dihapus

---

## 📚 Dokumentasi Swagger

> **Dokumentasi API interaktif** yang dihasilkan otomatis dari anotasi JSDoc

### 🌐 Akses Dokumentasi

Setelah server berjalan, akses dokumentasi interaktif:

| Tipe | URL | Deskripsi |
|------|-----|-----------|
| **UI** | `http://localhost:<PORT>/api/docs` | Swagger UI Interaktif |
| **JSON** | `http://localhost:<PORT>/api/docs.json` | Spesifikasi OpenAPI mentah |

### 📝 Contoh URL

Jika berjalan di port default (5000):
- **Swagger UI**: `http://localhost:5000/api/docs`
- **OpenAPI JSON**: `http://localhost:5000/api/docs.json`

### 🔧 Detail Teknis

- **Dihasilkan oleh**: `swagger-jsdoc` dan `swagger-ui-express`
- **Sumber**: Anotasi JSDoc di `src/routes/*.js`
- **Konfigurasi**: `src/docs/swagger.js`
- **Fitur**: 
  - Testing API interaktif
  - Contoh request/response
  - Testing autentikasi
  - Validasi schema

---

## 🚀 Testing dengan Postman

> **Collection Postman** untuk testing API dengan mudah

### 📥 Import Collection

1. **Download Collection**: [user_management_api.postman_collection.json](./src/docs/postman/user_management_api.postman_collection.json)
2. **Import ke Postman**: 
   - Buka Postman
   - Klik "Import" 
   - Drag & drop file collection atau pilih file
3. **Set Environment Variables**:
   - `base_url`: `http://localhost:5000`
   - `token`: (akan diisi otomatis setelah login)

### 🔧 Cara Penggunaan

1. **Start Server**: Pastikan server berjalan (`npm run dev`)
2. **Register User**: Jalankan request "Register" untuk membuat akun baru
3. **Login**: Jalankan request "Login" untuk mendapatkan token
4. **Test Protected Routes**: Token akan otomatis digunakan untuk request yang membutuhkan autentikasi

### 📋 Collection Features

- ✅ **Authentication Flow**: Register → Login → Use Token
- ✅ **All Endpoints**: Semua endpoint API tersedia
- ✅ **Auto Token**: Token otomatis disimpan dan digunakan
- ✅ **Environment Ready**: Siap digunakan dengan environment variables
- ✅ **Request Examples**: Contoh request body untuk setiap endpoint

### 🎯 Quick Test

```bash
# 1. Start server
npm run dev

# 2. Import collection ke Postman
# 3. Run "Register" request
# 4. Run "Login" request  
# 5. Test protected endpoints (token akan otomatis digunakan)
```