export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Cosplay AI Backend</h1>
      <p>
        This service provides API endpoints for analyzing cosplay photos and
        generating effect prompts.
      </p>
      <p>
        Use <code>/api/health</code>, <code>/api/analyze</code>, and{" "}
        <code>/api/generate</code>.
      </p>
    </main>
  );
}
