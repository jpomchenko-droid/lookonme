"use client";

import { useState } from "react";

export default function Home() {
  const [personFile, setPersonFile] = useState(null);
  const [clothesFile, setClothesFile] = useState(null);

  const [personPreview, setPersonPreview] = useState(null);
  const [clothesPreview, setClothesPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState("");

  function handlePersonImage(event) {
    const file = event.target.files?.[0];

    if (file) {
      setPersonFile(file);
      setPersonPreview(URL.createObjectURL(file));
      setResultImage(null);
      setError("");
    }
  }

  function handleClothesImage(event) {
    const file = event.target.files?.[0];

    if (file) {
      setClothesFile(file);
      setClothesPreview(URL.createObjectURL(file));
      setResultImage(null);
      setError("");
    }
  }

  async function handleTryOn() {
    if (!personFile || !clothesFile) {
      setError("Please upload both photos.");
      return;
    }

    setLoading(true);
    setError("");
    setResultImage(null);

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
        throw new Error(data.error || "Virtual try-on failed.");
      }

      if (!data.result) {
        throw new Error("No result image was returned.");
      }

      setResultImage(data.result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const canTryOn = Boolean(personFile && clothesFile && !loading);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1c1c1c",
        color: "white",
        padding: "35px 20px 70px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          marginBottom: "10px",
        }}
      >
        LOOKONME
      </h1>

      <p
        style={{
          color: "#aaa",
          fontSize: "20px",
          marginBottom: "60px",
        }}
      >
        AI Virtual Try-On
      </p>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <h2>1. Upload your photo</h2>

        <label
          style={{
            display: "block",
            background: "#000",
            padding: "18px",
            borderRadius: "14px",
            cursor: "pointer",
            marginBottom: "16px",
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

        {personPreview && (
          <img
            src={personPreview}
            alt="Your preview"
            style={{
              width: "100%",
              maxHeight: "520px",
              objectFit: "contain",
              borderRadius: "14px",
              marginBottom: "45px",
            }}
          />
        )}

        <h2>2. Upload clothing</h2>

        <label
          style={{
            display: "block",
            background: "#000",
            padding: "18px",
            borderRadius: "14px",
            cursor: "pointer",
            marginBottom: "16px",
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

        {clothesPreview && (
          <img
            src={clothesPreview}
            alt="Clothing preview"
            style={{
              width: "100%",
              maxHeight: "520px",
              objectFit: "contain",
              borderRadius: "14px",
              marginBottom: "35px",
            }}
          />
        )}

        <button
          type="button"
          onClick={handleTryOn}
          disabled={!canTryOn}
          style={{
            width: "100%",
            padding: "20px",
            border: "none",
            borderRadius: "14px",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: canTryOn ? "pointer" : "not-allowed",
            background: canTryOn ? "#ffffff" : "#444",
            color: canTryOn ? "#111" : "#aaa",
          }}
        >
          {loading ? "Creating your look..." : "Try On"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "25px",
              padding: "16px",
              background: "#3b1515",
              borderRadius: "12px",
              color: "#ffb3b3",
            }}
          >
            {error}
          </div>
        )}

        {resultImage && (
          <div style={{ marginTop: "45px" }}>
            <h2>Your new look</h2>

            <img
              src={resultImage}
              alt="AI virtual try-on result"
              style={{
                width: "100%",
                borderRadius: "16px",
                marginTop: "15px",
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
