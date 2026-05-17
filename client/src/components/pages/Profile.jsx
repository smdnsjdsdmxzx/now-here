import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { prepareProfilePhoto } from "../../lib/imageTools";
import "./Profile.css";

function formatKm(meters = 0) {
  return `${(meters / 1000).toFixed(1)} km`;
}

function buildProfileForm(user = {}) {
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    avatarName: user.avatarName || "",
    profilePhoto: user.profilePhoto || "",
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, loadingProfile, logout, updateProfile } = useAuth();
  const stats = profile?.stats || {
    postsCount: 0,
    receivedLikes: 0,
    likesGiven: 0,
    commentsGiven: 0,
    distanceMeters: 0,
  };
  const displayUser = profile?.user || user || {};
  const initials = `${displayUser.firstName?.[0] || "N"}${displayUser.lastName?.[0] || "H"}`;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => buildProfileForm(displayUser));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Lutfen gorsel dosyasi sec.");
      return;
    }

    try {
      const photo = await prepareProfilePhoto(file);
      setForm((current) => ({ ...current, profilePhoto: photo }));
      setError("");
    } catch (err) {
      setError(err.message || "Profil fotografi hazirlanamadi.");
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateProfile(form);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Profil kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  function handleToggleEdit() {
    if (!editing) {
      setForm(buildProfileForm(displayUser));
      setError("");
      setEditing(true);
      return;
    }

    setEditing(false);
    setError("");
    setForm(buildProfileForm(displayUser));
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <main className="profile-page">
      <div className="profile-motion" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <header className="profile-nav">
        <Link to="/" className="profile-brand">
          <span className="mini-emblem" aria-hidden="true" />
          NOW Here
        </Link>
        <nav>
          <Link to="/map">Harita</Link>
          <button type="button" onClick={handleLogout}>
            Cikis
          </button>
        </nav>
      </header>

      <section className={`profile-hero ${editing ? "is-editing" : ""}`}>
        <div className="profile-avatar">
          {displayUser.profilePhoto ? <img src={displayUser.profilePhoto} alt="" /> : <span>{initials}</span>}
        </div>
        <div className="profile-copy">
          <p className="profile-kicker">Kullanici profili</p>
          <h1>{displayUser.avatarName || displayUser.displayName}</h1>
          <p>
            {displayUser.firstName} {displayUser.lastName} - {displayUser.email}
          </p>
          <div className="profile-mini-metrics" aria-label="Hizli istatistikler">
            <span>{stats.postsCount} paylasim</span>
            <span>{stats.receivedLikes} alinan begeni</span>
            <span>{formatKm(stats.distanceMeters)} rota</span>
          </div>
        </div>
        <button type="button" className="profile-edit-button" onClick={handleToggleEdit}>
          {editing ? "Vazgec" : "Profili duzenle"}
        </button>
      </section>

      {editing && (
        <form className="profile-edit-card" onSubmit={handleSave}>
          {error && <p className="profile-error">{error}</p>}
          <div className="profile-edit-preview" aria-hidden="true">
            <div className="profile-avatar preview-avatar">
              {form.profilePhoto ? <img src={form.profilePhoto} alt="" /> : <span>{initials}</span>}
            </div>
            <div>
              <span>Canli onizleme</span>
              <strong>{form.avatarName || "Avatar adi"}</strong>
              <small>
                {form.firstName || "Ad"} {form.lastName || "Soyad"}
              </small>
            </div>
          </div>
          <div className="profile-form-grid">
            <label>
              <span>Ad</span>
              <input name="firstName" value={form.firstName} onChange={updateField} required />
            </label>
            <label>
              <span>Soyad</span>
              <input name="lastName" value={form.lastName} onChange={updateField} required />
            </label>
            <label>
              <span>Avatar adi</span>
              <input name="avatarName" value={form.avatarName} onChange={updateField} required />
            </label>
            <label>
              <span>Profil fotografi</span>
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </label>
          </div>
          <div className="profile-edit-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button type="button" className="secondary-profile-button" onClick={handleToggleEdit}>
              Iptal
            </button>
          </div>
        </form>
      )}

      <section className="profile-stats" aria-label="Profil istatistikleri">
        <article>
          <strong>{stats.postsCount}</strong>
          <span>Paylasim</span>
          <i style={{ "--fill": `${Math.min(stats.postsCount * 18, 100)}%` }} />
        </article>
        <article>
          <strong>{stats.receivedLikes}</strong>
          <span>Alinan begeni</span>
          <i style={{ "--fill": `${Math.min(stats.receivedLikes * 12, 100)}%` }} />
        </article>
        <article>
          <strong>{stats.likesGiven}</strong>
          <span>Attigin begeni</span>
          <i style={{ "--fill": `${Math.min(stats.likesGiven * 10, 100)}%` }} />
        </article>
        <article>
          <strong>{stats.commentsGiven}</strong>
          <span>Yorum</span>
          <i style={{ "--fill": `${Math.min(stats.commentsGiven * 14, 100)}%` }} />
        </article>
        <article>
          <strong>{formatKm(stats.distanceMeters)}</strong>
          <span>Kaydedilen rota</span>
          <i style={{ "--fill": `${Math.min((stats.distanceMeters / 1000) * 8, 100)}%` }} />
        </article>
      </section>

      <section className="profile-grid">
        <article className="profile-card">
          <h2>Rozetler</h2>
          <div className="badge-grid">
            {(profile?.badges || []).map((badge) => (
              <div className={`badge-card ${badge.unlocked ? "is-unlocked" : ""}`} key={badge.id}>
                <span className="badge-status">{badge.unlocked ? "Acildi" : "Kilitli"}</span>
                <strong>{badge.title}</strong>
                <span>{badge.description}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="profile-card">
          <h2>Paylasimlarim</h2>
          <HistoryList loading={loadingProfile} items={profile?.posts} empty="Henuz paylasim yok." />
        </article>

        <article className="profile-card">
          <h2>Begendigim postlar</h2>
          <HistoryList loading={loadingProfile} items={profile?.likedPosts} empty="Henuz begendigin post yok." />
        </article>

        <article className="profile-card">
          <h2>Yorumlarim</h2>
          <div className="history-list">
            {loadingProfile && <p>Yukleniyor...</p>}
            {!loadingProfile && !profile?.comments?.length && <p>Henuz yorum yok.</p>}
            {profile?.comments?.map((comment) => (
              <div className="history-item" key={comment._id}>
                <strong>{comment.postTitle}</strong>
                <span>{comment.text}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

function HistoryList({ items = [], empty, loading }) {
  return (
    <div className="history-list">
      {loading && <p>Yukleniyor...</p>}
      {!loading && !items.length && <p>{empty}</p>}
      {items.map((item) => (
        <div className="history-item" key={item._id}>
          <strong>{item.placeName || "Konum"}</strong>
          <span>{item.description || "Fotografli paylasim"}</span>
          <small>
            {item.likes || 0} begeni - {(item.comments || []).length} yorum
          </small>
        </div>
      ))}
    </div>
  );
}
