Crea un progetto web fullstack chiamato **ToDoShare** con le seguenti caratteristiche:

---

🔧 **Frontend**:

- Usa **Next.js** solo come router e struttura (non usare JSX né TypeScript)  
- Le pagine devono essere generate con **JavaScript**, **HTML5** e **CSS3**  
- Usa **Three.js** per animazioni o interfaccia 3D (per la dashboard o homepage interattiva)  
- Organizza il codice frontend in:
  - `/frontend/pages` → HTML delle pagine principali (login, register, dashboard, impostazioni)
  - `/frontend/components` → Componenti UI modulari in JavaScript
  - `/frontend/styles` → CSS modulari per ogni componente
  - `/frontend/public` → Assets statici (icone, immagini, animazioni)

---

🔐 **Backend**:

- Usa **Node.js** con **Express.js** come server  
- Implementa **autenticazione sicura con email/password**, usando:
  - `bcrypt` per hashare e validare le password
  - `jsonwebtoken` (JWT) per mantenere l'utente autenticato
- Organizza il backend in:
  - `/backend/routes` → API REST per utenti, task, file, autenticazione
  - `/backend/controllers` → Logica delle API (es. AuthController.js)
  - `/backend/models` → Schemi MongoDB per utenti, task, file (usa Mongoose)
  - `/backend/middlewares` → Middleware per logging, autenticazione JWT, gestione errori
  - `/backend/server.js` → Entrypoint backend

---

🗄️ **Database**:

- Usa **MongoDB** per la gestione di utenti, task e file  
- Collezioni principali:
  - `users`: { id, nome, email, password (hash bcrypt), ruolo, avatar, preferenze }
  - `tasks`: { id, titolo, descrizione, stato, assegnatario, scadenza, tags }
  - `files`: { id, nome, link, dimensione, versione, permessi, owner }

---

🧠 **Login/Registrazione (sicura)**:

- `/register`: salva un nuovo utente con la password hashata (`bcrypt.hash`)  
- `/login`: confronta email/password (`bcrypt.compare`), genera JWT se valido  
- Token JWT usato per accedere alle API protette (via middleware `auth.js`)

---

💡 **Funzionalità richieste nella prima release**:

- Login e registrazione (con hashing password sicuro)
- Creazione e condivisione di To-Do list
- Upload file (limite 10MB)
- Notifiche base via email (placeholder/fake API)
- Gamification (XP, livelli base)
- Interfaccia responsive ispirata a palette: **bianco**, **blu scuro**, **giallo dorato**, **grigio chiaro**, **viola chiaro**

---

🌍 **Setup Replit**:

- Crea script separati per:
  - frontend: `npm run dev`
  - backend: `node backend/server.js`
- Aggiungi istruzioni nel `README.md` per:
  - Avvio locale (dev) del frontend e backend
  - Connessione a MongoDB (`MONGODB_URI`)
  - Uso delle variabili d’ambiente (.env): `JWT_SECRET`, `MONGODB_URI`, ecc.

---

📁 **Struttura parziale del progetto**:

```
/todoshare
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── public/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── server.js
│
├── database/
│   └── mongoose.js
│
├── .env
├── README.md
└── package.json
```

---

📏 **Convenzioni di scrittura consigliate**:

- **Cartelle**: minuscole, nomi descrittivi (`routes`, `models`, `components`)
- **File JS**:
  - Controller, model, classi: **PascalCase** (`User.js`, `AuthController.js`)
  - Funzioni, middleware: **camelCase** (`auth.js`, `validateInput.js`)
- **CSS**: moduli separati, nomi in kebab-case (`form-login.css`)
- **HTML/JS**: niente JSX, solo Vanilla + DOM

---

🎯 **Obiettivo**:  
App ToDo collaborativa, moderna, estensibile, con backend sicuro, interfaccia web dinamica, gestione file e task condivisi.
