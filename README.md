# Notes API

A simple **Node.js + Express + MongoDB** REST API to create, read, update, and delete notes.

---

## 🚀 Features
- Create new notes
- Retrieve all notes
- Retrieve a single note by ID
- Update notes
- Delete notes
- MongoDB + Mongoose for storage

---

## 📦 Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **dotenv** for environment variables
- **nodemon** (dev dependency) for hot reload

---

## ⚙️ Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/GrimCoder-666/NoteKeeper.git
   cd NoteKeeper

2. **Create .env file**
   ```bash
   PORT = 5000
   MONGO_URI = mongodb://127.0.0.1:27017/notesdb

3. **Install Dependencies**
   ```bash
   npm install

4. **Run the server**
   ```bash
   #development mode
   npm run dev
   
   #Production mode
   npm start

## 📂 Project Structure
```bash
notes-api/
├── routes/
│   └── notes.js
├── models/
│   └── Note.js
├── .gitignore
├── server.js
├── package.json
├── .env
└── README.md
```

## 📄 API Endpoints

| Method | Endpoint                  | Description                              | Request Body (JSON) Example                               | Success Response Example |
|--------|---------------------------|------------------------------------------|----------------------------------------------------------|--------------------------|
| GET    | `/api/notes`              | Get all notes                            | _None_                                                   | `[{ "_id": "...", "title": "...", "content": "...", ... }]` |
| GET    | `/api/notes/:id`          | Get a single note by ID                  | _None_                                                   | `{ "_id": "...", "title": "...", "content": "...", ... }` |
| POST   | `/api/notes`              | Create a new note                        | `{ "title": "My first note", "content": "Learning Node.js is fun!" }` | `{ "_id": "...", "title": "...", "content": "...", ... }` |
| PUT    | `/api/notes/:id`          | Update a note by ID                      | `{ "title": "Updated title", "content": "Updated content" }` | `{ "_id": "...", "title": "...", "content": "...", ... }` |
| DELETE | `/api/notes/:id`          | Delete a note by ID                      | _None_                                                   | `{ "message": "Note deleted successfully" }` |

