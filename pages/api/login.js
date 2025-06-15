// pages/api/login.js (contoh nama file)
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  // Ambil dari .env.local
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  // Validasi
  if (username === validUsername && password === validPassword) {
      res.status(200).json({ success: true });
  } else {
      res.status(401).json({ success: false, message: 'Login gagal' });
  }
}