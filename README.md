# 🛒 Community Cart

## Overview

**Community Cart** is a mobile-first web application designed to help individuals and small households collaborate and save money on bulk purchases. In an age where the cost of living continues to rise, many people — especially students and small families — struggle to afford larger grocery packs or special deals due to budget constraints and waste concerns. 

Community Cart solves this problem by allowing users to:
- Post and join shopping trips for bulk purchases.
- Collaborate with others in real-time.
- Track spending per trip and get a summary of past spending.

Users can easily browse trips, join or leave them with flexibility, and enjoy a streamlined, clutter-free user experience. Though developed as a **BCIT CST school project**, this concept has real-world potential and could expand based on future demand and interest.

🔐 **Note**: Users must log in (via Firebase Authentication) to access full features like joining trips or tracking expenses. Non-authenticated users can view certain pages, but actions are restricted.

🌐 **Live App**: [https://communitycart.netlify.app/](https://communitycart.netlify.app/)

---

## ✨ Features

- Post or join local shopping trips to split bulk purchases.
- Filter through available groups with trip info and updates.
- Track your spending per trip and over the last 2 months.
- Responsive, mobile-first design for easy on-the-go use.
- Authentication and user data stored securely via Firebase.

---

## 🧰 Technologies Used

- **Frontend**: HTML, CSS, JavaScript, TailwindCSS
- **Backend & Hosting**: Firebase (Authentication, Firestore, Rules), Netlify (Frontend Hosting)
- **Design & Planning**:
  - Figma for UI/UX prototyping
  - FigJam for ideation
  - Trello board for Agile planning
  - GitHub for team collaboration and version control

---

## 🚀 Usage

1. Visit the app at [https://communitycart.netlify.app](https://communitycart.netlify.app).
2. Sign up or log in to gain full access.
3. Explore available shopping trips or create a new one.
4. Join a trip and track your spending — it's that simple!

---

## 🗂️ Project Structure
```
CommunityCart/
├── 404.html # Custom error page
├── firebase.json # Firebase project configuration
├── firestore.rules # Firestore security rules
├── firestore.indexes.json # Firestore indexing configuration
├── index.html # Landing page
├── login.html # Login screen
├── home.html # Main feed/dashboard (Authenticated users only)
├── profile.html # User profile page
├── groups.html # All available shopping groups
├── groupinfo.html # Specific group details
├── spendings.html # Overall spending summary
├── spendingsinfo.html # Detailed breakdown of a user's spending
├── mainspending.html # Consolidated spending overview page
├── README.md # Project documentation
├── styles/
│ └── style.css # Custom styles (overrides TailwindCSS if needed)
├── images/
│ ├── *.jpg / *.png / *.gif # UI images, backgrounds, product photos, etc.
│ └── favicon_io/ # Favicon assets
├── pages/ # (Currently unused directory)
├── scripts/
│ ├── firebaseAPI_DTC14.js # Firebase config and initialization
│ ├── authentication.js # Auth functions (login/logout/session management)
│ ├── group.js # Logic for creating and managing shopping groups
│ ├── groupinfo.js # Group info page logic
│ ├── home.js # Home page dynamic content
│ ├── profile.js # Profile page functionality
│ ├── spendings.js # Logic for spending tracking
│ ├── spendingsinfo.js # Logic for detailed spending breakdown
│ ├── mainspendings.js # Main spending management functionality
│ ├── post.js # Logic for adding and viewing posts
│ ├── location.js # Location-based features
│ ├── deleteOldPosts.js # Deletes expired posts
│ ├── utils.js # Utility functions
│ ├── skeleton.js # Skeleton screens or loading logic
│ ├── script.js # Shared/global scripts
│ └── tailwind.config.js # TailwindCSS configuration
```
---

## 👥 Contributors

- **Emanuel Fisha Molla** – BCIT CST Student  
  - Main Design and development both in backend and frontend,  
  - Fun Fact: Loves playing chess ("Aka wasting time, depending on the day.")  

- **Jun** – BCIT CST Student  
  - UI/UX Design Contributor  
  - Assisted in structuring frontend templates and layout.

- **Allen** – BCIT CST Student  
  - Frontend & UI/UX Design Support 
  - Fun Fact: Enjoys solving puzzles and writing clean, elegant code.

---

## 🙌 Acknowledgments

- **Firebase** – Authentication, Firestore, and Hosting.
- **Netlify** – Fast and free frontend deployment.
- **Figma & FigJam** – UI prototyping and collaborative ideation tools.
- **Icons & Images** – Unsplash, FontAwesome, and other open-source design resources.
- **Code Support** – Snippets and logic references from MDN Web Docs and Stack Overflow.

---

## 🚧 Limitations & Future Work

### Known Limitations
- No notifications/reminders for upcoming group trips.
- Users can browse content unauthenticated but can't take actions.
- No advanced filtering or sorting on trips yet.

### Future Enhancements
- Add GPS-based suggestions and local group filtering.
- Enable notifications and calendar syncs for trips.
- Introduce chat/messaging features for trip coordination.
- Add trip rating system and purchase history export.

---

Let us know what you think, or contribute ideas on [GitHub](https://github.com/Emanuel-DevX)!