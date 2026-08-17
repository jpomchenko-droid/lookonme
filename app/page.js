"use client";

import { useState } from "react";

const translations = {
  ru: {
    title: "LOOKONME",
    subtitle: "AI Виртуальная примерка",
    person: "1. Загрузите своё фото",
    personBtn: "Выбрать фото",
    clothes: "2. Загрузите одежду",
    clothesBtn: "Выбрать одежду",
    tryOn: "Примерить",
    processing: "AI создаёт ваш новый образ...",
    wait: "Это может занять некоторое время. Пожалуйста, не закрывайте страницу.",
    result: "Ваш новый образ",
    missing: "Пожалуйста, загрузите своё фото и фото одежды.",
    error: "Не удалось выполнить примерку. Попробуйте ещё раз.",
    changePerson: "Изменить фото",
    changeClothes: "Изменить одежду",
  },

  uk: {
    title: "LOOKONME",
    subtitle: "AI Віртуальна примірка",
    person: "1. Завантажте своє фото",
    personBtn: "Обрати фото",
    clothes: "2. Завантажте одяг",
    clothesBtn: "Обрати одяг",
    tryOn: "Приміряти",
    processing: "AI створює ваш новий образ...",
    wait: "Це може зайняти деякий час. Будь ласка, не закривайте сторінку.",
    result: "Ваш новий образ",
    missing: "Будь ласка, завантажте своє фото та фото одягу.",
    error: "Не вдалося виконати примірку. Спробуйте ще раз.",
    changePerson: "Змінити фото",
    changeClothes: "Змінити одяг",
  },

  en: {
    title: "LOOKONME",
    subtitle: "AI Virtual Try-On",
    person: "1. Upload your photo",
    personBtn: "Choose photo",
    clothes: "2. Upload clothing",
    clothesBtn: "Choose clothing",
    tryOn: "Try On",
    processing: "AI is creating your new look...",
    wait: "This may take a little while. Please keep this page open.",
    result: "Your new look",
    missing: "Please upload both your photo and a clothing photo.",
    error: "The try-on could not be completed. Please try again.",
    changePerson: "Change photo",
    changeClothes: "Change clothing",
  },

  de: {
    title: "LOOKONME",
    subtitle: "Virtuelle KI-Anprobe",
    person: "1. Laden Sie Ihr Foto hoch",
    personBtn: "Foto auswählen",
    clothes: "2. Kleidung hochladen",
    clothesBtn: "Kleidung auswählen",
    tryOn: "Anprobieren",
    processing: "KI erstellt Ihren neuen Look...",
    wait: "Dies kann etwas dauern. Bitte lassen Sie diese Seite geöffnet.",
    result: "Ihr neuer Look",
    missing: "Bitte laden Sie Ihr Foto und ein Foto der Kleidung hoch.",
    error: "Die Anprobe konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.",
    changePerson: "Foto ändern",
    changeClothes: "Kleidung ändern",
  },

  es: {
    title: "LOOKONME",
    subtitle: "Probador virtual con IA",
    person: "1. Sube tu foto",
    personBtn: "Elegir foto",
    clothes: "2. Sube la prenda",
    clothesBtn: "Elegir prenda",
    tryOn: "Probar",
    processing: "La IA está creando tu nuevo look...",
    wait: "Esto puede tardar un poco. Por favor, mantén esta página abierta.",
    result: "Tu nuevo look",
    missing: "Por favor, sube tu foto y una foto de la prenda.",
    error: "No se pudo completar la prueba. Inténtalo de nuevo.",
    changePerson: "Cambiar foto",
    changeClothes: "Cambiar prenda",
  },
};

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [personFile, setPersonFile] = useState(null);
  const [clothesFile, setClothesFile] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [clothesPreview, setClothesPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = translations[language];

  function handlePerson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPersonFile(file);
    setPersonPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  }

  function handleClothes(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setClothesFile(file);
    setClothesPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  }

  async function handleTryOn() {
    if (!personFile || !clothesFile) {
      setError(t.missing);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

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

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "white",
        padding: "25px 14px 60px",
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
            marginBottom: "20px",
          }}
        >
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: "#1c1c1c",
              color: "white",
              border: "1px solid #444",
              borderRadius: "10px",
              padding: "9px 12px",
              fontSize: "15px",
            }}
          >
            <option value="ru">🇷🇺 Русский</option>
            <option value="uk">🇺🇦 Українська</option>
            <option value="en">🇬🇧 English</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="es">🇪🇸 Español</option>
          </select>
        </div>

        <h1
          style={{
            textAlign: "center",
            fontSize: "36px",
            marginBottom: "8px",
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#999",
            fontSize: "17px",
            marginBottom: "45px",
          }}
        >
          {t.subtitle}
        </p>

        <section style={{ marginBottom: "45px" }}>
          <h2 style={{ textAlign: "center", fontSize: "23px" }}>
            {t.person}
          </h2>

          <label
            style={{
              ...buttonStyle,
              display: "block",
              boxSizing: "border-box",
              textAlign: "center",
              background: "#fff",
              color: "#000",
              margin: "18px 0",
            }}
          >
            {personPreview ? t.changePerson : t.personBtn}

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
              alt="
