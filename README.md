# User Management API

API Manajemen User sederhana yang dibuat menggunakan [Express](https://expressjs.com/) dengan [PostgreSQL](https://www.postgresql.org/) dan [Cloudinary](https://cloudinary.com/) untuk menyimpan foto/avatar.

Project ini ditujukan untuk menyelesaikan tugas Backend Part 3 di [Celerates](https://celerates.co.id)

---

## Tech Stack
- Node.js (ES Modules)
- Express
- PostgreSQL (`pg`)
- Cloudinary untuk hosting foto/avatar
- Multer untuk menangani upload multipart
- Bcrypt untuk password hashing
- JSON Web Tokens untuk autentikasi
- Helmet & CORS untuk kemananan HTTP

---

## Prasyarat

- Node.js (>=16)
- npm
- PostgreSQL database
- Akun Cloudinary (hosting foto/avatar)

---

## Installasi

1. **Clone Repository**
    ```
    git clone https://github.com/rizqishq/user_management_api
    cd user_management_api
    ```

1. **Install Dependensi**
   ```
   npm install
   ```

2. **Konfigurasi Environment**
   - Salin [`.env.example`](./.env.example) menjadi `.env` dan sesuaikan parameternya.

3. **Setup database**
   - Pastikan PostgreSQL sudah berjalan dan konfigurasi di `.env` sudah benar.
   - Jalankan perintah berikut untuk membuat tabel:
     ```bash
     npm run setup-db
     ```

4. **Jalankan server**
   - Untuk mode development (hot reload):
     ```
     npm run dev
     ```
API akan berjalan di port sesuai konfigurasi pada `.env` (default: 3000).

---

## API Endpoints

Base URL: `http://localhost:<PORT>` (default `3000`)

Auth routes (`/api/auth`)
- `POST /api/auth/register`
  - Public
  - Body (JSON):
    ```
    {
        "username": "nama",
        "email": "email",
        "password": "password",
        "confirmPassword": "password"
    }
    ```
  - Respon: Mengembalikan data pengguna yang telah dibuat (tanpa password)

- `POST /api/auth/login`
  - Public
  - Body (JSON): 
    ```
    {
        "email": "email",
        "password": "password"
    }
    ```
  - Respon: `{ token, user }` jika berhasil login

User routes (mounted at `/api/user`) — Semua Protected (Membutuhkan `Authorization: Bearer <token>`)
- `GET /api/user/`
  - Mengembalikan daftar pengguna (hanya data publik)

- `GET /api/user/:id`
  - Mengembalikan data pengguna berdasarkan id

- `PUT /api/user/:id`
  - Memperbarui profil pengguna (harus pengguna yang sama dengan token 'id')
  - Body (JSON): Salah satu dari
    ```
    {
        "username": "nama_baru",
        "email": "email_baru"
    }
    ```
  - Respon: Data pengguna yang telah diperbarui

- `POST /api/user/:id/avatar`
  - Upload avatar untuk pengguna dengan `id` tertentu (hanya pemilik akun yang dapat mengubah)
  - **Form field**: `file`
  - **Tipe file yang diterima**: `image/jpeg`, `image/png`, `image/gif`
  - **Ukuran maksimum**: 5 MB
  - **Hasil**: Diunggah ke [Cloudinary](https://cloudinary.com) dan memperbarui kolom `avatar_url` di database

- `DELETE /api/user/:id`
  - Menghapus akun pengguna (hanya pemilik akun yang dapat menghapus)
  - Respon: Data pengguna yang telah dihapus
