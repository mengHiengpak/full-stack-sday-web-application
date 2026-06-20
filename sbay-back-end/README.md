# PTV Social Media Platform 🔴⚪

A full-stack social media app with React.js frontend and Node.js + MongoDB backend.
Colors: Red (#cc0000) and White — clean, bold, and modern.

---

## 📁 Project Structure

```
ptv/
├── backend/          ← Node.js + Express API
│   ├── models/       ← MongoDB schemas (User, Post, Comment)
│   ├── routes/       ← API endpoints (auth, users, posts, comments)
│   ├── middleware/   ← JWT auth guard, Cloudinary upload
│   ├── .env.example  ← Copy to .env and fill in your values
│   ├── server.js     ← Entry point
│   └── package.json
│
└── frontend/         ← React.js app
    ├── src/
    │   ├── components/   ← Navbar, PostCard, CommentSection, CreatePost
    │   ├── pages/        ← Home, Login, Register, Profile, Explore, Admin
    │   ├── context/      ← AuthContext (global user state)
    │   ├── utils/        ← Axios API instance
    │   └── index.css     ← Global PTV red/white theme
    └── package.json
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

**.env values you need:**
- `MONGO_URI` — MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string
- `CLOUDINARY_*` — free account at cloudinary.com (for image/video upload)

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**
Backend runs on **http://localhost:5000**

---

## ✅ Features

### 👤 Auth
- Register / Login / Logout
- JWT token authentication
- Protected routes

### 👥 User Profile
- Profile picture (upload via Cloudinary)
- Cover photo (upload via Cloudinary)
- Bio, website, location
- Follow / Unfollow users
- Followers / Following counts

### 📝 Posts
- Create posts with text, title, and optional photo or video
- Visibility: Public / Friends / Private
- Like posts (toggle)
- Share posts (copy link)
- Edit post title and content (with edit history)
- Delete posts (owner or admin)

### 💬 Comments
- Add comments to posts
- Reply to comments (threaded)
- Like comments
- Edit and delete own comments

### 🔴 Admin Panel
- View all users and posts
- Delete any user (and their posts)
- Delete any post
- Stats overview (total users, posts, media)

### 🔍 Explore
- Browse all public posts
- User search in navbar

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS (red + white PTV theme) |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer + Cloudinary |

---

## 🎨 Design System

- **Primary Color:** `#cc0000` (PTV Red)
- **Font:** Bebas Neue (logo/display) + Nunito (body)
- **Theme:** Red and White only — bold, modern, social

---

## 🔐 Making a User Admin

In MongoDB, update a user's role manually:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Or via MongoDB Compass / Atlas.
