"use client";

import { useState } from "react";

export default function Home() {
  const [personImage, setPersonImage] = useState(null);
  const [clothesImage, setClothesImage] = useState(null);

  function handlePersonImage(event) {
    const file = event.target.files?.[0];
    if (file) {
      setPersonImage(URL.createObjectURL(file));
    }
  }

  function handleClothesImage(event) {
    const file = event.target.files?.[0];
    if (file) {
      setClothesImage(URL.createObjectURL(file));
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        padding: "30px 15px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "38px",
          marginBottom: "5px",
        }}
      >
        LOOKONME
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
          fontSize: "18px",
        }}
      >
        AI Virtual Try-On
      </p>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          background: "white",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2>1. Upload your photo</h2>

        <label
          style={{
            display: "block",
            padding: "15px",
            margin: "15px 0",
            background: "#111",
            color: "white",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          Choose photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePersonImage}
            style={{ display: "none" }}
          />
        </label>

        {personImage && (
          <img
            src={personImage}
            alt="Person"
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              borderRadius: "12px",
              marginBottom: "25px",
            }}
          />
        )}

        <h2>2. Upload clothing</h2>

        <label
          style={{
            display: "block",
            padding: "15px",
            margin: "15px 0",
            background: "#111",
            color: "white",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          Choose clothing
          <input
            type="file"
            accept="image/*"
            onChange={handleClothesImage}
            style={{ display: "none" }}
          />
        </label>

        {clothesImage && (
          <img
            src={clothesImage}
            alt="Clothing"
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              borderRadius: "12px",
              marginBottom: "25px",
            }}
          />
        )}

        <button
          disabled={!personImage || !clothesImage}
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "10px",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor:
              personImage && clothesImage ? "pointer" : "not-allowed",
            background:
              personImage && clothesImage ? "#111" : "#cccccc",
            color: "white",
          }}
        >
          Try On
        </button>
      </div>
    </main>
  );
}
