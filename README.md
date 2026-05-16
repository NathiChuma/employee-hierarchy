# Employee Hierarchy Management System

A cloud-hosted employee management application built for the EPI-USE Africa technical assessment.

The system allows users to manage employee information, reporting structures, and organisational hierarchy visualisation through an intuitive and responsive web interface.

## Live Demo

* Live Application: https://employee-hierarchy-omega.vercel.app
* Frontend Repository: https://github.com/NathiChuma/employee-hierarchy
* Backend Repository: https://github.com/NathiChuma/employee-hierarchy-backend

---

# Features

* Create, update, and delete employees
* Organisational hierarchy visualisation
* Employee search and filtering
* Employee detail panel
* Reporting line management
* Gravatar avatar integration
* Dark/light theme toggle
* Responsive modern UI

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite

## Backend

* Node.js
* Express.js

## Database

* Firebase Firestore

## Other Tools

* Firebase Admin SDK
* Gravatar

---

# System Architecture

The application follows a client-server architecture:

* The frontend handles UI rendering and user interaction
* The backend exposes REST API endpoints
* Firestore stores employee data and hierarchy relationships

Employees are linked using a `managerId` field to generate the organisational hierarchy tree.

---

# Installation

## Clone Repository

```bash
git clone https://github.com/NathiChuma/employee-hierarchy.git
```

---

# Frontend Setup

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

# Environment Variables

Create a `.env` file and configure the following:

```env
VITE_API_URL=your_backend_url
```

---

# Backend Setup

Backend repository:

```bash
git clone https://github.com/NathiChuma/employee-hierarchy-backend.git
```

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm start
```

---

# Backend Environment Variables

Create a `.env` file:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

---

# API Endpoints

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | /employees/getEmployees       | Retrieve all employees |
| POST   | /employees/createEmployee     | Create employee        |
| PUT    | /employees/updateEmployee/:id | Update employee        |
| DELETE | /employees/deleteEmployee/:id | Delete employee        |

---

# Future Improvements

* Authentication and authorization
* Role-based permissions
* Drag-and-drop hierarchy editing
* Employee image uploads
* Automated testing
* Pagination and advanced filtering

---

# Author

Nkosinathi Chuma
