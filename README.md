# 🎫 tiket-com | Web3 Event Ticketing Platform

`tiket-com` adalah platform penjualan tiket berbasis **Web3** yang sedang dalam tahap pengembangan. Proyek ini menggabungkan teknologi **Smart Contract (Solidity)** untuk transparansi & keamanan transaksi, dan **React TypeScript (TSX)** di sisi frontend untuk pengalaman pengguna yang modern dan interaktif.

> 🚧 Masih dalam tahap pengembangan aktif — fitur dan dokumentasi akan terus diperbarui secara berkala.

---

## ✨ Fitur Utama

- 🔐 **Integrasi Web3 Wallet (Metamask, WalletConnect)**
- 🏷️ **Penjualan Tiket via Smart Contract** di jaringan blockchain
- 📄 **Metadata Tiket disimpan di IPFS**
- 🧾 **Manajemen Event & Tipe Tiket**
- 👤 **Autentikasi dengan Web3 (wallet-based login)**
- 🎨 **Frontend modern dengan React + Tailwind + Framer Motion**

---

## ⚙️ Teknologi yang Digunakan

| Komponen      | Teknologi             |
|---------------|------------------------|
| Smart Contract | Solidity              |
| Frontend      | React + TypeScript (TSX) |
| UI Framework  | Tailwind CSS + Shadcn UI + Framer Motion |
| IPFS          | Pinata |
| Wallet        | Ethers.js |
| Dev Tools     | Hardhat / Ethers, Vite |
| Versi Node    | `>=18.x` |

---

## 🚀 Instalasi & Pengembangan Lokal

### 1. Clone Repository
```bash
git clone https://github.com/fardann-arbazz/tiket-com.git
cd tiket-com
```

### 2. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Smart Contract
cd ../contracts
npm install
```

### 3. Setup Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```bash
cp .env.example .env
```

Isi dengan:

```
VITE_CONTRACT_ADDRESS=0x...
VITE_NETWORK=sepolia
```

### 4. Deploy Smart Contract
Gunakan Hardhat:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Jalankan Frontend
```bash
cd frontend
npm run dev
```

Akses di: [http://localhost:5173](http://localhost:5173)

## 🧪 Testing Smart Contract

```bash
cd contracts
npx hardhat test
```

Untuk menjalankan script simulasi/tes jaringan, bisa gunakan jaringan testnet seperti Sepolia atau Hardhat Network lokal.

---

## 🛠️ Roadmap

| Versi | Status | Fitur                                               |
|-------|--------|------------------------------------------------------|
| v0.1.0 | ✅     | Deploy Smart Contract Dasar + Integrasi Web3 Wallet |
| v0.2.0 | 🔧     | Sistem Tipe Tiket, IPFS Metadata, UI React Dasar   |
| v0.3.0 | ⏳     | Halaman Event Publik, Minting Tiket NFT             |
| v1.0.0 | 🔜     | Full Launch — Admin Panel, Pembayaran Lanjutan     |

---

## 🤝 Kontribusi

Kontribusi sangat terbuka! Berikut langkah-langkahnya:

1. Fork repo ini
2. Buat branch fitur: `git checkout -b fitur/namamu`
3. Commit perubahan: `git commit -m "feat: tambah fitur X"`
4. Push ke branch kamu: `git push origin fitur/namamu`
5. Buat Pull Request 🎉

---

## 📃 Lisensi

Proyek ini menggunakan lisensi **MIT**. Lihat [LICENSE](./LICENSE) untuk detail.

---

## 🔄 Catatan

Platform ini **masih dalam tahap pengembangan aktif**. Nantikan:

- 📢 Pengumuman fitur baru

📬 Jika ingin berdiskusi atau berkolaborasi, hubungi [@buildwithabas](https://github.com/fardann-arbazz).

---

> Dibangun dengan semangat Web3 & komunitas. 🚀
