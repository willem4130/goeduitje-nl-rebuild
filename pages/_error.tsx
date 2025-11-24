import { NextPageContext } from "next";

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "4rem", margin: 0 }}>{statusCode || "Error"}</h1>
      <p style={{ fontSize: "1.25rem", color: "#666" }}>
        {statusCode === 404
          ? "Pagina niet gevonden"
          : "Er is iets misgegaan"}
      </p>
      <a
        href="/"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "0.375rem",
        }}
      >
        Terug naar home
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
