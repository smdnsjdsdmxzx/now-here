import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Giriş başarısız");
        return;
      }

      // ✅ TOKEN KAYDET
      localStorage.setItem("token", data.token);

      // ✅ HARİTAYA GİT
      navigate("/map");
    } catch (err) {
      console.log(err);
      alert("Sunucu hatası");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>NowHere</h1>

      <input
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        placeholder="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleLogin}>Giriş Yap</button>
    </div>
  );
}