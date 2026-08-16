"use client";

import { useState } from "react";

export default function Home() {
  const [person, setPerson] = useState(null);
  const [clothes, setClothes] = useState(null);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f4f2",
        fontFamily: "Arial, sans-serif",
        padding: "30px 20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "38px", marginBottom: "5px" }}>
        LOOKONME
      </h1>

      <p style={{ color: "#666", marginBottom: "35px" }}>
        AI Virtual Try-On
      </p>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          background: "white",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <h2>Примерьте одежду онлайн</h2>

        <p>Загрузите своё фото</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPerson(e.target.files[0])}
        />

        {person && (
          <p style={{ color: "green" }}>✓ Фото загружено</p>
        )}

        <p style={{ marginTop: "30px" }}>
          Загрузите фото одежды
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setClothes(e.target.files[0])}
        />

        {clothes && (
          <p style={{ color: "green" }}>✓ Одежда загружена</p>
        )}

        <button
          style={{
            marginTop: "35px",
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "12px",
            background: "black",
            color: "white",
            fontSize: "18px",
          }}
        >
          Примерить
        </button>
      </div>
    </main>
  );
}
