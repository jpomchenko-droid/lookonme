"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const translations = {
  ru: {
    subtitle: "AI Виртуальная примерка",
    person: "1. Загрузите своё фото",
    choosePerson: "Выбрать фото",
    changePerson: "Изменить фото",
    clothes: "2. Загрузите одежду",
    chooseClothes: "Выбрать одежду",
    changeClothes: "Изменить одежду",
    tryOn: "Примерить",
    processing: "AI создаёт ваш новый образ...",
    wait: "Пожалуйста, не закрывайте страницу.",
    result: "Ваш новый образ",
    save: "Сохранить",
    share: "Поделиться",
    missing: "Загрузите фото человека и фото одежды.",
    error: "Не удалось выполнить примерку.",
    copied: "Ссылка скопирована",
  },

  uk: {
    subtitle: "AI Віртуальна примірка",
    person: "1. Завантажте своє фото",
    choosePerson: "Обрати фото",
    changePerson: "Змінити фото",
    clothes: "2. Завантажте одяг",
    chooseClothes: "Обрати одяг",
    changeClothes: "Змінити одяг",
    tryOn: "Приміряти",
    processing: "AI створює ваш новий образ...",
    wait: "Будь ласка, не закривайте сторінку.",
    result: "Ваш новий образ",
    save: "Зберегти",
    share: "Поділитися",
    missing: "Завантажте фото людини та фото одягу.",
    error: "Не вдалося виконати примірку.",
    copied: "Посилання скопійовано",
  },

  en: {
    subtitle: "AI Virtual Try-On",
    person: "1. Upload your photo",
    choosePerson: "Choose photo",
    changePerson: "Change photo",
    clothes: "2. Upload clothing",
    chooseClothes: "Choose clothing",
    changeClothes: "Change clothing",
    tryOn: "Try On",
    processing: "AI is creating your new look...",
    wait: "Please keep this page open.",
    result: "Your new look",
    save: "Save",
    share: "Share",
    missing: "Please upload both images.",
    error: "The try-on could not be completed.",
    copied: "Link copied",
  },

  de: {
    subtitle: "Virtuelle KI-Anprobe",
    person: "1. Laden Sie Ihr Foto hoch",
    choosePerson: "Foto auswählen",
    changePerson: "Foto ändern",
    clothes: "2. Kleidung hochladen",
    chooseClothes: "Kleidung auswählen",
    changeClothes: "Kleidung ändern",
    tryOn: "Anprobieren",
    processing: "KI erstellt Ihren neuen Look...",
    wait: "Bitte lassen Sie diese Seite geöffnet.",
    result: "Ihr neuer Look",
    save: "Speichern",
    share: "Teilen",
    missing: "Bitte laden Sie beide Bilder hoch.",
    error: "Die Anprobe konnte nicht abgeschlossen werden.",
    copied: "Link kopiert",
  },

  es: {
    subtitle: "Probador virtual con IA",
    person: "1. Sube tu foto",
    choosePerson: "Elegir foto",
    changePerson: "Cambiar foto",
    clothes: "2. Sube la prenda",
    chooseClothes: "Elegir prenda",
    changeClothes: "Cambiar prenda",
    tryOn: "Probar",
    processing: "La IA está creando tu nuevo look...",
    wait: "Por favor, mantén esta página abierta.",
    result: "Tu nuevo look",
    save: "Guardar",
    share: "Compartir",
    missing: "Sube las dos imágenes.",
    error: "No se pudo completar la prueba.",
    copied: "Enlace copiado",
  },
};

const languages = [
  ["ru", "🇷🇺 Русский"],
  ["uk", "🇺🇦 Українська"],
  ["en", "🇬🇧 English"],
  ["de", "🇩🇪 Deutsch"],
  ["es", "🇪🇸 Español"],
];

export default function Home() {
  const [language, setLanguage] = useState("ru");

  const [personFile, setPersonFile] = useState(null);
  const [clothesFile, setClothesFile] = useState(null);

  const [personPreview, setPersonPreview] = useState("");
  const [clothesPreview, setClothesPreview] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = translations[language];

  function handlePerson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPersonFile(file);
    setPersonPreview(URL.createObjectURL(file));
    setResult("");
    setError("");
  }

  function handleClothes(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setClothesFile(file);
    setClothesPreview(URL.createObjectURL(file));
    setResult("");
    setError("");
  }

  async function handleTryOn() {
    if (!personFile || !clothesFile) {
      setError(t.missing);
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();

      formData.append("person", personFile);
      formData.append("clothes", clothesFile);

      const response = await fetch("/api/tryon", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t.error);
      }

      if (!data?.result) {
        throw new Error(t.error);
      }

      setResult(data.result);
    } catch (err) {
      setError(err?.message || t.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;

    try {
      const response = await fetch(result);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "LOOKONME-look.jpg";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.open(result, "_blank");
    }
  }

  async function handleShare() {
    if (!result) return;

    try {
      const response = await fetch(result);
      const blob = await response.blob();

      const file = new File(
        [blob],
        "LOOKONME-look.jpg",
        { type: blob.type || "image/jpeg" }
      );

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: "LOOKONME",
          text: t.result,
          files: [file],
        });

        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: "LOOKONME",
          text: t.result,
          url: result,
        });

        return;
      }

      await navigator.clipboard.writeText(result);
      alert(t.copied);
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error(err);
      }
    }
  }

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const imageStyle = {
    width: "100%",
    maxHeight: "540px",
    objectFit: "contain",
    background: "#eee",
    borderRadius: "16px",
  };
    return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "24px 14px 60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "28px",
          }}
        >
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            style={{
              background: "#222",
              color: "white",
              border: "1px solid #555",
              borderRadius: "12px",
              padding: "10px 12px",
              fontSize: "15px",
            }}
          >
            {languages.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <h1
          style={{
            textAlign: "center",
            fontSize: "38px",
            margin: "0 0 8px",
          }}
        >
          LOOKONME
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#999",
            fontSize: "17px",
            margin: "0 0 45px",
          }}
        >
          {t.subtitle}
        </p>

        <section style={{ marginBottom: "42px" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            {t.person}
          </h2>

          <label
            style={{
              ...buttonStyle,
              display: "block",
              boxSizing: "border-box",
              textAlign: "center",
              background: "#1f1f1f",
              color: "white",
              margin: "18px 0",
            }}
          >
            {personPreview ? t.changePerson : t.choosePerson}

            <input
              type="file"
              accept="image/*"
              onChange={handlePerson}
              style={{ display: "none" }}
            />
          </label>

          {personPreview && (
            <img
              src={personPreview}
              alt="Person preview"
              style={imageStyle}
            />
          )}
        </section>

        <section style={{ marginBottom: "34px" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            {t.clothes}
          </h2>

          <label
            style={{
              ...buttonStyle,
              display: "block",
              boxSizing: "border-box",
              textAlign: "center",
              background: "#1f1f1f",
              color: "white",
              margin: "18px 0",
            }}
          >
            {clothesPreview ? t.changeClothes : t.chooseClothes}

            <input
              type="file"
              accept="image/*"
              onChange={handleClothes}
              style={{ display: "none" }}
            />
          </label>

          {clothesPreview && (
            <img
              src={clothesPreview}
              alt="Clothing preview"
              style={imageStyle}
            />
          )}
        </section>

        <button
          type="button"
          onClick={handleTryOn}
          disabled={loading || !personFile || !clothesFile}
          style={{
            ...buttonStyle,
            background:
              loading || !personFile || !clothesFile
                ? "#444"
                : "#ffffff",
            color:
              loading || !personFile || !clothesFile
                ? "#999"
                : "#000000",
            marginTop: "10px",
          }}
        >
          {loading ? t.processing : t.tryOn}
        </button>

        {loading && (
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "14px",
              background: "#171717",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "4px solid #444",
                borderTop: "4px solid white",
                borderRadius: "50%",
                margin: "0 auto 14px",
                animation: "spin 1s linear infinite",
              }}
            />

            <strong>{t.processing}</strong>

            <p
              style={{
                marginBottom: 0,
                color: "#aaa",
                lineHeight: "1.5",
              }}
            >
              {t.wait}
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "12px",
              background: "#301515",
              lineHeight: "1.5",
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <section style={{ marginTop: "45px" }}>
            <h2
              style={{
                textAlign: "center",
                marginBottom: "18px",
              }}
            >
              {t.result}
            </h2>

            <img
              src={result}
              alt="AI try-on result"
              style={imageStyle}
            />

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "18px",
              }}
            >
              <button
                type="button"
                onClick={handleSave}
                style={{
                  ...buttonStyle,
                  background: "#ffffff",
                  color: "#000000",
                }}
              >
                ↓ {t.save}
              </button>

              <button
                type="button"
                onClick={handleShare}
                style={{
                  ...buttonStyle,
                  background: "#1f1f1f",
                  color: "#ffffff",
                  border: "1px solid #555",
                }}
              >
                ↗ {t.share}
              </button>
            </div>
          </section>
        )}

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </main>
  );
}
