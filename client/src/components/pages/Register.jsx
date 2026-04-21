import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Kayıt başarılı");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Kayıt Ol</h1>

      <input placeholder="E-posta" onChange={(e) => setEmail(e.target.value)} />
      <br />

      <input type="password" placeholder="Şifre" onChange={(e) => setPassword(e.target.value)} />
      <br />

      <button onClick={register}>Kayıt Ol</button>
    </div>
  );
}

export default Register;