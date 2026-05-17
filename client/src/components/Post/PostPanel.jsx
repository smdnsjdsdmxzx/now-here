import { useState } from "react";
import Camera from "./Camera";
import "./PostPanel.css";

const categories = [
  { value: "genel", label: "Genel" },
  { value: "kafe", label: "Kafe" },
  { value: "doga", label: "Doga" },
  { value: "etkinlik", label: "Etkinlik" },
  { value: "spor", label: "Spor" },
  { value: "sanat", label: "Sanat" },
  { value: "yemek", label: "Yemek" },
  { value: "alisveris", label: "Alisveris" },
];

export default function PostPanel({ location, onSubmit, onClose }) {
  const [form, setForm] = useState({
    description: "",
    placeName: "Bulundugum nokta",
    category: "genel",
  });
  const [image, setImage] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Lutfen gorsel dosyasi sec.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Gorsel 4 MB altinda olmali.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      setError("");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.description.trim() && !image) {
      setError("Bir not yaz veya fotograf ekle.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit({
        description: form.description.trim(),
        placeName: form.placeName.trim() || "Konum",
        category: form.category,
        image,
      });
    } catch (err) {
      setError(err.message || "Paylasim gonderilemedi.");
    } finally {
      setLoading(false);
    }
  }

  if (showCamera) {
    return (
      <Camera
        onCapture={(imageData) => {
          setImage(imageData);
          setShowCamera(false);
        }}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <div className="post-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="post-panel"
        aria-labelledby="post-panel-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="post-panel-header">
          <div>
            <p>Yeni paylasim</p>
            <h2 id="post-panel-title">Bu noktayi isaretle</h2>
          </div>
          <button type="button" className="icon-close" onClick={onClose} aria-label="Paneli kapat">
            x
          </button>
        </header>

        {error && (
          <p className="post-error" role="alert">
            {error}
          </p>
        )}

        <form className="post-form" onSubmit={handleSubmit}>
          <label>
            <span>Mekan adi</span>
            <input
              name="placeName"
              value={form.placeName}
              onChange={updateField}
              maxLength={120}
            />
          </label>

          <fieldset className="category-picker">
            <legend>Kategori</legend>
            <div>
              {categories.map((category) => (
                <button
                  type="button"
                  className={form.category === category.value ? "is-selected" : ""}
                  key={category.value}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      category: category.value,
                    }))
                  }
                >
                  <span className={`category-dot category-${category.value}`} aria-hidden="true" />
                  {category.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            <span>Not</span>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Burasi nasil bir yer?"
              maxLength={500}
              rows={4}
            />
          </label>
          <div className="character-row">
            <span>
              {location[0].toFixed(5)}, {location[1].toFixed(5)}
            </span>
            <span>{form.description.length} / 500</span>
          </div>

          {image && (
            <figure className="image-preview">
              <img src={image} alt="Paylasim onizlemesi" />
              <button type="button" onClick={() => setImage("")}>
                Gorseli kaldir
              </button>
            </figure>
          )}

          <div className="media-actions">
            <button type="button" className="soft-button" onClick={() => setShowCamera(true)}>
              Kamera
            </button>
            <label className="soft-button file-button">
              Galeri
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <button type="submit" className="post-submit" disabled={loading}>
            {loading ? "Paylasiliyor..." : "Haritaya ekle"}
          </button>
        </form>
      </section>
    </div>
  );
}
