# Cosplay AI Backend (MVP)

This repository contains the backend for an AI-powered cosplay photo special effects platform. It is built with **Next.js (App Router)** and **TypeScript**, and integrates with the **OpenAI API** to analyze cosplay images and create effect prompts.

> ✅ Backend-only MVP: no frontend UI, no database, no authentication.

---

## 📦 Folder Structure

```
Backend/
├─ app/
│  ├─ api/
│  │  ├─ analyze/route.ts
│  │  ├─ generate/route.ts
│  │  └─ health/route.ts
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
├─ lib/
│  ├─ openai.ts
│  ├─ prompts.ts
│  ├─ types.ts
│  └─ validators.ts
├─ .env.example
├─ next.config.js
├─ next-env.d.ts
├─ package.json
└─ tsconfig.json
```

---

## 🚀 Setup (Local)

1. Copy `.env.example` to `.env`:

   ```bash
   cd Backend
   cp .env.example .env
   ```

2. Fill in your OpenAI API key:

   ```env
   OPENAI_API_KEY=sk-...
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser (optional). The backend endpoints are available under `/api`.

---

## ✅ Available API Endpoints

### Health check

- **GET** `/api/health`

Returns a simple JSON response confirming the service is running.

### Analyze (cosplay image analysis)

- **POST** `/api/analyze`
- Content-Type: `multipart/form-data`
- Fields:
  - `image`: image file
  - `userPrompt`: string
  - `effectType`: optional string

Returns a structured analysis with:

- `sceneDescription`
- `detectedSubject`
- `recommendedEffects`
- `compositionNotes`
- `finalPrompt`

### Generate (image generation placeholder)

- **POST** `/api/generate`
- Content-Type: `application/json`
- Body:
  - `finalPrompt`: string
  - `effectType`: optional string

Returns a placeholder response and is designed for easy future upgrade to actual image generation.

---

## 🧪 How to Test (Examples)

### Health

```bash
curl http://localhost:3000/api/health
```

### Analyze

```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "userPrompt=Add a glowing magic circle and soft blue aura" \
  -F "effectType=magic_circle" \
  -F "image=@/path/to/cosplay.jpg"
```

### Generate

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"finalPrompt": "A fantasy cosplay portrait with glowing wings"}'
```

---

## 🧩 Notes & Next Steps

- The analysis route uses the OpenAI Responses API and returns a JSON structure that is designed for later image editing.
- The generate route currently returns a placeholder response, but it is structured so you can swap in a real image generation implementation later.

---

## 🛠️ Need to Extend?

- Add an effect library module (e.g., `lib/effects.ts`) to store prebuilt effect definitions.
- Add a persistence layer (database) when ready to store user history.
- Add auth when the platform needs user accounts.
