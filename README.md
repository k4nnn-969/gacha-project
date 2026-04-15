# Backend Programming Template 2025 - Gacha API

Aplikasi undian dengan sistem gacha menggunakan Express.js + MongoDB.

## Setup & Cara Menjalankan

### 1. Clone / Fork Repository

```bash
git clone <url-repo-anda>
cd backend-programming-template-2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Buat file `.env`

Salin `.env.example` menjadi `.env` lalu isi:

```
PORT=5000
DB_CONNECTION=mongodb://localhost:27017/
DB_NAME=gacha_db
```

### 4. Jalankan Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

---

## Endpoint API

Base URL: `http://localhost:5000/api`

---

### 1. POST `/api/gacha` — Lakukan Gacha

Endpoint utama untuk melakukan undian gacha.

**Request Body (JSON):**

| Field       | Tipe   | Wajib | Keterangan              |
|-------------|--------|-------|-------------------------|
| `user_id`   | String | Ya    | ID unik user            |
| `user_name` | String | Ya    | Nama lengkap user       |

**Contoh Request:**
```json
{
  "user_id": "user123",
  "user_name": "Jane Doe"
}
```

**Contoh Response Menang:**
```json
{
  "success": true,
  "prize": "Smartphone X",
  "message": "Selamat! Anda memenangkan: Smartphone X",
  "gacha_id": "663abc...",
  "attempts_today": 1,
  "remaining_attempts": 4
}
```

**Contoh Response Tidak Menang:**
```json
{
  "success": true,
  "prize": null,
  "message": "Maaf, Anda tidak memenangkan hadiah kali ini. Coba lagi!",
  "gacha_id": "663abc...",
  "attempts_today": 2,
  "remaining_attempts": 3
}
```

**Error - kuota harian habis:**
```json
{
  "statusCode": 403,
  "error": "FORBIDDEN_ERROR",
  "description": "Kuota gacha harian sudah habis. Maksimal 5 kali per hari."
}
```

---

### 2. GET `/api/gacha/history/:user_id` — Riwayat Gacha User (Bonus)

Melihat seluruh riwayat gacha user beserta hadiah yang dimenangkan.

**Contoh:** `GET /api/gacha/history/user123`

**Contoh Response:**
```json
{
  "user_id": "user123",
  "total_attempts": 3,
  "history": [
    {
      "gacha_id": "663abc...",
      "date": "2026-04-15",
      "prize": "Smartphone X",
      "created_at": "2026-04-15T10:00:00.000Z"
    }
  ]
}
```

---

### 3. GET `/api/gacha/prizes` — Daftar Hadiah & Kuota Tersisa (Bonus)

Menampilkan semua hadiah beserta sisa kuota pemenang.

**Contoh Response:**
```json
{
  "prizes": [
    { "prize": "Emas 10 gram", "total_quota": 1, "winners_count": 0, "remaining_quota": 1 },
    { "prize": "Smartphone X", "total_quota": 5, "winners_count": 2, "remaining_quota": 3 }
  ]
}
```

---

### 4. GET `/api/gacha/winners` — Daftar Pemenang per Hadiah (Bonus)

Daftar pemenang setiap hadiah dengan nama yang disamarkan.

**Contoh Response:**
```json
{
  "winners": [
    {
      "prize": "Emas 10 gram",
      "total_quota": 1,
      "winners": [{ "masked_name": "J*** D*e", "won_at": "2026-04-15T10:00:00.000Z" }]
    }
  ]
}
```

---

## Daftar Hadiah

| No | Hadiah            | Kuota Pemenang |
|----|-------------------|----------------|
| 1  | Emas 10 gram      | 1              |
| 2  | Smartphone X      | 5              |
| 3  | Smartwatch Y      | 10             |
| 4  | Voucher Rp100.000 | 100            |
| 5  | Pulsa Rp50.000    | 500            |

> Kuota di atas adalah kuota per **periode undian**, bukan per hari.

## Aturan Gacha

- Setiap user maksimal **5 kali gacha per hari**
- Kuota hadiah berlaku untuk seluruh periode undian
- Semua aktivitas gacha dicatat di database MongoDB
