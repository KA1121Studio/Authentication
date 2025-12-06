import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "no email" });

  // 6桁コード生成
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Vercel (Serverless) では保存場所が必要 → Cookie で保持
  res.setHeader(
    "Set-Cookie",
    `otp_${email}=${otp}; Path=/; HttpOnly; Max-Age=300; SameSite=Strict`
  );

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "ログインコード",
      html: `<p>あなたのログインコードは <b>${otp}</b> です。</p>`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "send failed" });
  }
}
