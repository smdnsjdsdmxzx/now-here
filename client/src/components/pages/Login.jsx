import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../lib/api";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applySession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser(form);
      applySession(result);
      navigate(location.state?.from || "/map");
    } catch (err) {
      setError(err.message || "Giris yapilamadi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-motion-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Link to="/" className="auth-brand">
        <span className="mini-emblem" aria-hidden="true" />
        NOW Here
      </Link>

      <div className="auth-layout">
        <aside className="auth-showcase" aria-hidden="true">
          <div className="auth-compass">
            <span />
          </div>
          <div className="auth-showcase-copy">
            <strong>Canli harita hazir</strong>
            <span>Profilini, rozetlerini ve yakinindaki anilari tek akista ac.</span>
          </div>
          <div className="auth-mini-feed">
            <span>Yeni rota</span>
            <strong>3.2 km kesif</strong>
          </div>
        </aside>

        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-header">
            <p className="auth-kicker">Giris</p>
            <h1 id="login-title">E-posta ile gir</h1>
            <p>Harita, profil ve paylasim akisi icin oturum acman gerekiyor.</p>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              <span>E-posta</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="ornek@mail.com"
                value={form.email}
                onChange={updateField}
                required
              />
            </label>

            <label>
              <span>Sifre</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={updateField}
                required
              />
            </label>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Giris yapiliyor..." : "Giris yap"}
            </button>
          </form>

          <p className="auth-switch">
            Hesabin yok mu? <Link to="/register">Kodla kayit ol</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
