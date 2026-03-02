# 🎓 Campus Placement Portal

A full-stack **Campus Placement Management System** built using the **MERN Stack** to streamline internship and placement processes within educational institutions.

This platform connects **Students, Placement Cell, Mentors, and Employers** into a centralized digital ecosystem for managing internships, applications, approvals, analytics, and placements.

---

## 🚀 Features

### 👨‍🎓 Student Module
- Secure Registration & Login (JWT Authentication)
- Complete Profile Management
  - Skills
  - CGPA
  - Semester
  - Certifications
  - Resume Upload (Cloudinary Integration)
- Auto-calculated **Employability Score**
- Smart Internship Recommendations
- Apply for Internships
- Track Application Status
- Email Notifications
- Placement Progress Tracking

---

### 🏢 Placement Cell Module
- Analytics Dashboard:
  - Total Students
  - Students Placed
  - Placement Rate (%)
  - Department Distribution
  - Top In-Demand Skills
- Post / Edit / Delete Internships
- Manage Applications
- Monitor Student Progress
- Track Available Seats

---

### 👨‍🏫 Mentor Module
- Review Student Applications
- Approve / Reject Internship Requests
- Track Assigned Students

---

### 🏭 Employer Module
- Post Internship Opportunities
- View Applicants
- Shortlist Candidates
- Select / Reject Students
- Schedule Interviews

---

## 🧠 Smart Matching Algorithm

The system includes a custom internship recommendation engine that considers:

- Skills Match (Weighted Scoring)
- Department Eligibility
- Student Preferences
- Employability Score
- Placement Probability

This ensures relevant and personalized internship recommendations for students.

---

## 📊 Analytics Dashboard

Includes real-time statistics such as:

- Total Internships Posted
- Total Students Registered
- Students Placed
- Placement Rate Percentage
- Department-wise Distribution
- Most In-Demand Skills

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- Context API
- Tailwind CSS
- ShadCN UI
- Lucide Icons
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Role-Based Authorization
- Cloudinary (Resume Upload)
- Multer
- Streamifier
- Email Notifications

---

## 📂 Project Structure

```
Placement-Portal/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   │   └── matchingAlgorithm.js
│   └── server.js
│
├── frontend/
│   ├── components/
│   │   ├── student/
│   │   ├── placement/
│   │   ├── mentor/
│   │   └── employer/
│   ├── context/
│   ├── api/
│   └── App.jsx
│
└── README.md
```

---

## 🔐 Authentication & Authorization

- JWT-based Authentication
- Role-Based Access Control
- Protected Routes:
  - `/student/dashboard`
  - `/placement/dashboard`
  - `/mentor/dashboard`
  - `/employer/dashboard`

---

## 📂 Resume Upload System

- Resume uploaded using Multer
- Streamed directly to Cloudinary
- Secure URL stored in database
- Profile completion updated automatically
- Employability score recalculated dynamically

---

## 📩 Email Notification System

Automated emails for:
- Mentor Approval Requests
- Application Status Updates
- Interview Scheduling
- Selection / Rejection Notifications

---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/omarKhan56/Placement-Portal.git
cd Placement-Portal
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

Recommended Deployment Stack:

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas
- File Storage: Cloudinary

---

## 🎯 Problem Statement

Most educational institutions manage placement processes manually using spreadsheets and emails.

This platform:
- Centralizes placement operations
- Automates approvals
- Improves transparency
- Provides real-time analytics
- Enhances student-employer matching

---

## 🔮 Future Improvements

- AI-based Resume Analysis
- Real-time Notifications (WebSockets)
- Company Rating System
- Mock Interview Scheduling
- Admin Super Dashboard
- PDF Report Exports
- OTP Email Verification

---

## 👨‍💻 Author

**Omar Ali Khan**  
GitHub: https://github.com/omarKhan56

---

## 📜 License

This project is developed for academic and practical learning purposes.
