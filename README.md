# InboxPilot — AI Email Reply Assistant for Gmail

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Maven](https://img.shields.io/badge/Build-Maven-C71A36?logo=apachemaven&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)
![Gemini API](https://img.shields.io/badge/AI-Gemini%20API-8E75B2?logo=googlegemini&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

InboxPilot is a full-stack AI email assistant that generates context-aware, tone-controlled reply drafts. It ships as three integrated pieces: a **Chrome extension** that injects an "AI Reply" action directly into Gmail's compose toolbar, a **Spring Boot REST backend** that talks to Google's Gemini API, and a **React web app** for composing and previewing replies outside of Gmail.

> Built as a hands-on project to learn full-stack integration with LLM APIs — from prompt construction and reactive HTTP calls to browser-extension DOM manipulation and UI/theme design.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the repo](#1-clone-the-repo)
  - [2. Backend setup](#2-backend-setup)
  - [3. Frontend setup](#3-frontend-setup)
  - [4. Chrome extension setup](#4-chrome-extension-setup)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Engineering Notes](#engineering-notes)
- [License](#license)
- [Author](#author)

---

## Features

- **In-Gmail AI replies** — an "AI Reply" button appears directly in Gmail's compose toolbar, reads the open thread, and drops a generated draft in place.
- **Tone control** — generate replies as Professional, Casual, or Friendly.
- **Standalone web app** — a React interface for testing and previewing replies without needing Gmail open.
- **Reactive backend** — Spring WebFlux's `WebClient` used for non-blocking calls to the Gemini API.
- **Structured error handling** — JSON responses from the LLM are parsed defensively so malformed or empty completions don't break the UI.

## Architecture

<img width="772" height="440" alt="Screenshot 2026-08-03 034634" src="https://github.com/user-attachments/assets/203d35fb-2237-487d-aff5-856691c1b8e0" />


Both the extension and the web app are independent clients of the same backend — the extension embeds itself in Gmail's DOM, while the React app offers an isolated surface for testing the API without needing Gmail open.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java, Spring Boot, Spring WebFlux (`WebClient`) |
| Frontend | React (Vite), Material UI (MUI) |
| Browser Extension | Chrome Extension Manifest V3, vanilla JS |
| AI Provider | Google Gemini API |
| Build Tools | Maven, npm |

## Project Structure

```
email-writer/
├── email-writer-sb/         # Spring Boot backend
│   ├── src/main/java/com/email/writer/app/
│   │   ├── EmailGeneratorController.java
│   │   ├── EmailGeneratorService.java
│   │   └── EmailRequest.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── email-writer-react/      # React web app
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── email-writer-ext/        # Chrome extension (Manifest V3)
    ├── icons/
    ├── content.js
    ├── content.css
    └── manifest.json
```

## Getting Started

### Prerequisites

- **Java 21+** (JDK)
- **npm** (Node.js runtime)
- **Google Chrome**
- A **Gemini API key** — create one at [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repo

```bash
git clone https://github.com/PoojaSri-30/InboxPilot-AI-Email-Reply-Assistant.git
cd InboxPilot-AI-Email-Reply-Assistant
```

### 2. Backend setup

```bash
cd email-writer-sb
```

Set your Gemini credentials as environment variables (do **not** hardcode these in `application.properties`):

```bash
# macOS / Linux
export GEMINI_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key="
export GEMINI_KEY="your_api_key_here"

# Windows PowerShell
$env:GEMINI_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key="
$env:GEMINI_KEY="your_api_key_here"
```

Run the backend:

```bash
./mvnw spring-boot:run
```

The API will be live at `http://localhost:8080`.

Test it:

```bash
curl -X POST http://localhost:8080/api/email/generate \
  -H "Content-Type: application/json" \
  -d '{"emailContent":"Can we push the meeting to 3pm?","tone":"friendly"}'
```

### 3. Frontend setup

```bash
cd email-writer-react
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Chrome extension setup

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `email-writer-ext` folder
5. Open Gmail, open any email, click Reply — the **AI Reply** button appears in the compose toolbar

> The extension calls `http://localhost:8080`, so the backend must be running for it to work locally.

## API Reference

### `POST /api/email/generate`

Generates an AI email reply from provided content and an optional tone.

**Request body:**

```json
{
  "emailContent": "Can we push the meeting to 3pm?",
  "tone": "friendly"
}
```

**Response:** `200 OK` with the generated reply as plain text.

**Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `emailContent` | string | Yes | The original email content to reply to |
| `tone` | string | No | One of `professional`, `casual`, `friendly` |

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_URL` | Gemini `generateContent` endpoint, with trailing `?key=` |
| `GEMINI_KEY` | Your Gemini API key |

These are injected into `application.properties` via `${GEMINI_URL}` / `${GEMINI_KEY}` placeholders and must be provided at runtime — never committed to source control.

## Screenshots

<img width="1145" height="700" alt="Screenshot 2026-08-03 031636" src="https://github.com/user-attachments/assets/12361eee-640d-4450-b5d6-e3b9cc52514b" />


<img width="1067" height="406" alt="Screenshot 2026-08-03 031652" src="https://github.com/user-attachments/assets/0f03a388-c069-4884-bf4c-e6506e65ff3d" />

<img width="1163" height="701" alt="Screenshot 2026-08-03 031659" src="https://github.com/user-attachments/assets/075dfaf0-796f-44bb-9f61-e947497f4d9a" />

## Extension

<img width="1007" height="586" alt="Screenshot 2026-08-03 031611" src="https://github.com/user-attachments/assets/75760d81-d828-4b7a-ab16-1848632d3733" />

<img width="911" height="245" alt="Screenshot 2026-08-03 031629" src="https://github.com/user-attachments/assets/146b69f0-49ce-444c-b5e6-ce5c0e8ed9f9" />



## Known Limitations

- No authentication/rate-limiting on the backend yet — not safe to deploy publicly as-is without adding request throttling or an API key check.
- Single shared Gemini API key — usage is bounded by that key's quota.
- Not yet deployed; currently runs locally only.

## Future Roadmap

- [ ] Deploy backend (Render/Railway) and frontend (Vercel/Netlify)
- [ ] Add per-user API rate limiting
- [ ] Publish extension to the Chrome Web Store
- [ ] Add automated tests for prompt construction and response parsing
- [ ] Dark mode toggle for the web app

## Engineering Notes

A few non-trivial issues solved while building this, worth knowing about if you're extending the project:

- **Content-script DOM detection bug:** the original selector-matching loop in `content.js` returned on the first selector checked regardless of a match, causing unreliable detection of Gmail's compose toolbar. Fixed by moving the `return` inside the match condition.
- **Spring property placeholder resolution:** `${GEMINI_URL}` / `${GEMINI_KEY}` in `application.properties` only resolve if the corresponding environment variables are present in the process that starts Spring Boot — running via a terminal that hasn't set them (or via VS Code's Run button without a configured `launch.json`) throws a `PlaceholderResolutionException` at startup.

## License

This project is licensed under the [MIT License](./LICENSE).

## Author

**Pooja Sri**
GitHub: [@PoojaSri-30](https://github.com/PoojaSri-30)
