import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for student performance
  let studentData = [
    { id: 1, name: "Alice Johnson", grade: "A", attendance: 95, math: 92, science: 88, english: 94, history: 90 },
    { id: 2, name: "Bob Smith", grade: "B+", attendance: 88, math: 78, science: 82, english: 80, history: 85 },
    { id: 3, name: "Charlie Brown", grade: "A-", attendance: 92, math: 85, science: 90, english: 88, history: 82 },
    { id: 4, name: "Diana Prince", grade: "A+", attendance: 98, math: 98, science: 96, english: 95, history: 97 },
    { id: 5, name: "Ethan Hunt", grade: "B", attendance: 85, math: 72, science: 75, english: 82, history: 78 },
  ];

  // API Routes
  app.post("/api/verify-request", (req, res) => {
    const { contact } = req.body;
    console.log(`Verification code requested for: ${contact}`);
    // In a real app, you'd send an actual SMS or Email here.
    // For this demo, we'll just return success.
    res.json({ success: true, message: "Verification code sent (Mock: 123456)" });
  });

  app.post("/api/verify-code", (req, res) => {
    const { code } = req.body;
    if (code === "123456") {
      res.json({ success: true, token: "mock-jwt-token" });
    } else {
      res.status(400).json({ success: false, message: "Invalid verification code" });
    }
  });

  app.get("/api/performance", (req, res) => {
    // In a real app, you'd verify the token here.
    res.json(studentData);
  });

  app.get("/api/stats", (req, res) => {
    const subjects = ["math", "science", "english", "history"];
    const stats = subjects.reduce((acc, sub) => {
      const scores = studentData.map(s => (s as any)[sub]);
      acc[sub] = {
        avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        max: Math.max(...scores),
        min: Math.min(...scores)
      };
      return acc;
    }, {} as any);
    res.json(stats);
  });

  app.post("/api/students", (req, res) => {
    const newStudent = {
      id: studentData.length + 1,
      ...req.body
    };
    studentData.push(newStudent);
    res.json({ success: true, student: newStudent });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
