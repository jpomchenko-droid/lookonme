export const metadata = {
  title: "LOOKONME",
  description: "AI Virtual Try-On",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
