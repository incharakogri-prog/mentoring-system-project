# 🏫 Student Warden Alert System

A complete college hostel management system with QR-based entry tracking, parent notifications, and automated reminders.

---

## 📁 Project Structure

```
student-warden-alert-system/
├── index.html        ← Frontend (React + Tailwind via CDN)
├── server.js         ← Backend (Node.js + Express + Nodemailer)
├── package.json      ← Dependencies
├── .env.example      ← Environment variable template
└── README.md         ← This file
```

---

## ✅ Features

| Feature | Description |
|---|---|
| 🔐 Warden Login | Secure login page for warden access |
| 📝 Student Registration | Register students with parent info + auto email |
| 📷 QR Code System | Simulate QR scan for hostel check-in/check-out |
| 📊 Dashboard | Live stats: inside/outside/late counts |
| 📋 Attendance Table | Full attendance log with filters |
| ⚠️ Late Entry Alert | Auto email to parent when student enters late |
| ⏰ Reminder System | Auto reminder email before hostel closing |
| ⚙️ Settings | Configure weekday/weekend curfew times |
| 🔄 Daily Reset | Reminder flags auto-reset at midnight |
| ✅ Input Validation | All fields validated with error messages |

---

## 🚀 How to Run Locally

### Step 1: Install Node.js
Download from: https://nodejs.org/ (version 16 or higher)

### Step 2: Clone / Download the project
```bash
cd student-warden-alert-system
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Configure Email (Gmail SMTP)

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Edit `.env` with your Gmail credentials:
```
WARDEN_EMAIL=your_gmail@gmail.com
WARDEN_PASSWORD=your_16_char_app_password
```

3. **How to get Gmail App Password:**
   - Go to https://myaccount.google.com
   - Enable 2-Step Verification
   - Go to Security → App Passwords
   - Create a new App Password for "Mail"
   - Copy the 16-character password into `.env`

### Step 5: Start the Server
```bash
node server.js
```

Or for auto-restart during development:
```bash
npm run dev
```

### Step 6: Open the App
Open your browser and go to:
```
http://localhost:3000
```

---

## 🔐 Default Login Credentials

```
Username: warden
Password: hostel123
```

---

## 📧 Email API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check server status |
| POST | `/send-email` | Send email (registration, reminder, late-entry) |

### POST /send-email — Request Body Examples

**Registration Emails (sent to student + parent):**
```json
{
  "type": "registration",
  "student": {
    "name": "John Doe",
    "studentId": "CS001",
    "email": "john@college.edu",
    "phone": "9876543210",
    "parentName": "Mr. Doe",
    "parentEmail": "parent@gmail.com",
    "parentPhone": "9876543211"
  }
}
```

**Late Entry Alert (sent to parent):**
```json
{
  "type": "late-entry",
  "student": { ... },
  "entryTime": "9:45 PM",
  "closingTime": "9:00 PM"
}
```

**Reminder Email (sent to student):**
```json
{
  "type": "reminder",
  "student": { ... },
  "minutesLeft": 5,
  "closingTime": "9:00 PM"
}
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (CDN), Tailwind CSS (CDN), Babel (CDN) |
| Backend | Node.js, Express |
| Email | Nodemailer + Gmail SMTP |
| QR Code | qrcode.js library |
| Storage | localStorage (frontend), .env (backend config) |

---

## 📌 Important Notes

- All student data is stored in **browser localStorage**
- Email sending requires the Node.js backend to be running
- The QR scanner is **simulated** (select student + click scan)
- To test with a real QR scanner, integrate a camera-based QR library
- Reminder emails are checked every 30 seconds automatically

---

## 🎓 For Students / Learning

### Key Concepts Used:
1. **React Hooks**: `useState`, `useEffect`, `useRef`
2. **REST API**: `fetch()` calls to Express endpoints
3. **Nodemailer**: Gmail SMTP email sending
4. **LocalStorage**: Persistent frontend data storage
5. **Input Validation**: Client-side form validation
6. **Responsive Design**: Tailwind CSS grid/flex utilities
7. **Environment Variables**: `.env` file with `dotenv`

---

*Built with ❤️ for College Hostel Management*
# student-warden-alert
