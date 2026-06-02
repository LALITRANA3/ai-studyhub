# 🎓 AI StudyHub — CSE Student Intelligence Platform

## 📁 Project Structure
```
ai-studyhub/
├── frontend/         ← React.js (Tailwind CSS)
│   ├── src/
│   │   ├── components/   ← All UI components
│   │   ├── context/      ← Auth context
│   │   ├── services/     ← API + AI calls
│   │   └── pages/        ← Login page
│   └── package.json
└── backend/          ← Spring Boot (Java 17)
    ├── src/main/java/com/studyhub/
    │   ├── controller/   ← REST APIs
    │   ├── model/        ← JPA entities
    │   ├── repository/   ← DB access
    │   ├── security/     ← JWT auth
    │   └── config/       ← Spring Security config
    └── pom.xml
```

---

## ✅ Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| Java | 17+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org |
| VS Code | Latest | https://code.visualstudio.com |

---

## 🚀 HOW TO RUN IN VS CODE

### STEP 1 — Open Project
```
File → Open Folder → select the "ai-studyhub" folder
```

### STEP 2 — Install VS Code Extensions
Install these from the Extensions panel (Ctrl+Shift+X):
- **Extension Pack for Java** (Microsoft)
- **Spring Boot Extension Pack** (VMware)
- **ES7+ React/Redux/React-Native Snippets**
- **Tailwind CSS IntelliSense**

---

### STEP 3 — Run Frontend (React)

Open a **New Terminal** in VS Code (Ctrl+`):

```bash
cd frontend
npm install
npm start
```
✅ Frontend runs at: **http://localhost:3000**

---

### STEP 4 — Run Backend (Spring Boot)

Open **another terminal** (click + in terminal panel):

```bash
cd backend
./mvnw spring-boot:run
```
On Windows:
```cmd
cd backend
mvnw.cmd spring-boot:run
```
✅ Backend runs at: **http://localhost:8080**
✅ H2 Database console: **http://localhost:8080/h2-console**

> **Note:** Backend uses H2 in-memory database by default — no MySQL setup needed!

---

### STEP 5 — Add API Keys (Optional for full AI features)

Edit `backend/src/main/resources/application.properties`:

```properties
# FREE — Get from https://aistudio.google.com/
app.ai.gemini.api-key=YOUR_GEMINI_KEY

# FREE — Get from https://console.groq.com/
app.ai.groq.api-key=YOUR_GROQ_KEY
```

> **Without backend keys:** The React app still works fully — it calls Claude AI directly from the browser using the Anthropic API.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/profile` | Get current user |
| POST | `/api/ai/chat/groq` | Chat with Groq (Llama3) |
| POST | `/api/ai/chat/gemini` | Chat with Gemini |
| POST | `/api/ai/generate/mcq` | Generate MCQs |
| POST | `/api/ai/generate/flashcards` | Generate Flashcards |
| POST | `/api/ai/generate/roadmap` | Generate Roadmap |
| POST | `/api/notes/upload` | Upload PDF/DOCX |
| GET | `/api/notes` | Get user's notes |
| DELETE | `/api/notes/{id}` | Delete note |
| GET | `/api/progress` | Get user progress |
| POST | `/api/progress` | Save progress |

---

## 🔑 Demo Login
```
Email:    demo@cse.edu
Password: demo123
```

---

## 🏗️ Tech Stack

**Frontend**
- React 18 + React Router v6
- Tailwind CSS
- Chart.js + react-chartjs-2
- Axios
- react-hot-toast

**Backend**
- Spring Boot 3.2
- Spring Security + JWT (jjwt)
- Spring Data JPA
- H2 (dev) / MySQL (prod)
- Lombok

**AI**
- Anthropic Claude (frontend)
- Google Gemini API (free)
- Groq API (free, Llama3)

---

## 🔄 Switch to MySQL (Production)

1. Create database: `CREATE DATABASE studyhubdb;`
2. Edit `application.properties`:
```properties
# Comment out H2 lines, uncomment MySQL lines
spring.datasource.url=jdbc:mysql://localhost:3306/studyhubdb?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

---

## 📦 Build for Production

**Frontend:**
```bash
cd frontend && npm run build
```

**Backend:**
```bash
cd backend && ./mvnw clean package
java -jar target/ai-studyhub-backend-1.0.0.jar
```

---

## ✨ Features
- 🔐 JWT Authentication (Login/Register)
- 📤 PDF/DOCX Upload
- 💬 AI Chat with notes context
- ✅ MCQ Generator
- 🃏 Flashcard Generator  
- 🗺️ AI Career Roadmap
- 📄 Previous Year Questions (PYQ)
- ▶️ YouTube Recommendations
- 📈 Progress Tracker with Charts
- 🌙 Dark Theme UI
