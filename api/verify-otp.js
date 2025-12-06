export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "missing" });

  // Cookie からOTP取得
  const cookies = req.headers.cookie || "";
  const match = cookies.match(new RegExp(`otp_${email}=([^;]+)`));

  if (!match) return res.status(400).json({ error: "no otp" });

  const storedOtp = match[1];

  if (storedOtp !== otp) {
    return res.status(400).json({ error: "invalid" });
  }

  // 認証成功 → Cookie削除
  res.setHeader(
    "Set-Cookie",
    `otp_${email}=; Path=/; Max-Age=0; SameSite=Strict`
  );

  return res.status(200).json({ ok: true });
}
