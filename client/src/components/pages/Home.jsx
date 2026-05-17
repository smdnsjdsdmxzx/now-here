import { Link } from "react-router-dom";
import heroArt from "../../assets/hero.png";
import "./Home.css";

const highlights = [
  { value: "canli", label: "Konum bazli anilar" },
  { value: "hizli", label: "Tek dokunusla paylasim" },
  { value: "rahat", label: "Mobil uyumlu harita" },
];

const previewStats = [
  { value: "24", label: "aktif nokta" },
  { value: "8.4 km", label: "rota akisi" },
  { value: "92%", label: "kesif hizi" },
];

const orbitStats = [
  { value: "GPS", label: "gercek rota takibi" },
  { value: "Alan", label: "ekrana gore paylasim" },
  { value: "Rozet", label: "aktif profil gelisimi" },
  { value: "Akis", label: "canli yorum ve begeni" },
];

const featureCards = [
  {
    title: "Gorunen alan akisi",
    text: "Haritada ne kadar alan aciksa, panelde sadece o alandaki paylasimlar akar.",
  },
  {
    title: "Bolge zekasi",
    text: "Sehir, ilce veya bolge arayip akisi aninda tek bir lokasyona daralt.",
  },
  {
    title: "Gercek mesafe",
    text: "Rota puani, sadece cihazdan algilanan hareketle profile islenir.",
  },
  {
    title: "Sosyal hafiza",
    text: "Yorumlar, begeniler, rozetler ve paylasim gecmisi profilinde birikir.",
  },
];

const flowItems = ["Konumu ac", "Aniyi isaretle", "Yorumu yakala", "Rotayi tamamla"];
const headlineWords = ["Explore", "the", "Next", "Evolution", "of", "NOW", "Here"];

export default function Home() {
  return (
    <main className="home-page" style={{ "--hero-art": `url(${heroArt})` }}>
      <div className="zyra-space" aria-hidden="true">
        <span className="zyra-orbit orbit-a" />
        <span className="zyra-orbit orbit-b" />
        <span className="zyra-orbit orbit-c" />
        <span className="zyra-halo" />
        <span className="zyra-horizon" />
      </div>
      <div className="home-kinetic-bg" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <nav className="home-nav" aria-label="Ana gezinme">
        <Link to="/" className="brand-mark">
          <span className="brand-dot" aria-hidden="true" />
          NOW Here
        </Link>
        <div className="center-nav" aria-label="Bolumler">
          <a href="#vision">Vision</a>
          <a href="#layers">Layers</a>
          <a href="#flow">Flow</a>
        </div>
        <div className="home-actions">
          <Link to="/login" className="text-link">
            Giris
          </Link>
          <Link to="/register" className="pill-link">
            Kayit ol
          </Link>
        </div>
      </nav>

      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow reveal-line">Anilar haritada canlanir</p>
          <h1 className="zyra-headline" aria-label="Explore the Next Evolution of NOW Here">
            {headlineWords.map((word, index) => (
              <span style={{ "--delay": `${index * 90}ms` }} key={`${word}-${index}`}>
                {word}
              </span>
            ))}
          </h1>
          <p className="hero-text">
            Bulundugun yeri fotograf, not ve kategoriyle isaretle. Sehirdeki
            canli noktalar tek ekranda, hizli ve temiz bir harita deneyimiyle
            onunde dursun.
          </p>
          <div className="hero-buttons">
            <Link to="/map" className="primary-link">
              Haritayi ac
            </Link>
            <Link to="/register" className="secondary-link">
              Hesap olustur
            </Link>
          </div>
        </div>

        <div className="hero-preview" aria-hidden="true">
          <div className="preview-map">
            <div className="preview-scan" />
            <span className="pulse-marker marker-one" />
            <span className="pulse-marker marker-two" />
            <span className="pulse-marker marker-three" />
            <span className="pulse-marker marker-four" />
            <div className="preview-route" />
            <div className="preview-card preview-card-one">
              <strong>Karakoy</strong>
              <span>Kafe - 18 begeni</span>
            </div>
            <div className="preview-card preview-card-two">
              <strong>Moda sahil</strong>
              <span>Rota hazir - 12 dk</span>
            </div>
            <div className="preview-stats">
              {previewStats.map((item) => (
                <span key={item.label}>
                  <strong>{item.value}</strong>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <img src={heroArt} alt="" className="hero-art" />
        </div>
      </section>

      <section className="home-strip" aria-label="Ozellikler">
        {highlights.map((item) => (
          <div className="strip-item" key={item.value}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="home-intel" id="vision">
        <div className="intel-copy">
          <p className="eyebrow">Zyra web3 spatial design</p>
          <h2 className="scroll-title">Harita artik sadece zemin degil, canli bir sosyal katman.</h2>
          <p>
            NOW Here; paylasimlari ekrandaki harita alaniyla, bolge filtreleriyle,
            yorum akisiyle ve gercek hareket verisiyle birlestiren modern bir
            konum deneyimi olarak tasarlandi.
          </p>
        </div>
        <div className="orbit-board" aria-hidden="true">
          <span className="orbit-ring ring-one" />
          <span className="orbit-ring ring-two" />
          <span className="orbit-core" />
          {orbitStats.map((item, index) => (
            <div className={`orbit-chip orbit-chip-${index + 1}`} key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-grid" id="layers" aria-label="Deneyim katmanlari">
        {featureCards.map((card, index) => (
          <article className="feature-card scroll-card" style={{ "--delay": `${index * 80}ms` }} key={card.title}>
            <span />
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className="home-flow" id="flow">
        <div>
          <p className="eyebrow">Akiskan kesif</p>
          <h2 className="scroll-title">Paylasimdan rotaya kadar tek ritim.</h2>
        </div>
        <div className="flow-rail" aria-label="Uygulama akisi">
          {flowItems.map((item, index) => (
            <span key={item}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              {item}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
