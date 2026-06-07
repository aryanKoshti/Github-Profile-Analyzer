# GitHub Profile Analyzer API

## Overview

GitHub Profile Analyzer is a backend application built using Node.js, Express.js, MySQL, and GitHub REST API.

The application fetches GitHub user profile information, analyzes repositories, calculates developer insights, and stores the analyzed data in a MySQL database.

---

## Features

* Fetch GitHub user profile data
* Fetch public repositories
* Calculate total stars
* Calculate total forks
* Detect most used programming language
* Calculate developer score
* Store analyzed profiles in MySQL
* Update existing profiles automatically
* Retrieve all analyzed profiles
* Retrieve a specific analyzed profile

---

## Tech Stack

* Node.js
* Express.js
* MySQL
* GitHub REST API
* Axios
* dotenv

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd Github-Profile-Analyzer
```

Install dependencies:

```bash
npm install
```

Create a .env file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=github_analyzer
```

Run the application:

```bash
npm start
```

or

```bash
npm run dev
```

---

## Database Setup

Create database:

```sql
CREATE DATABASE github_analyzer;
```

Run the profiles table schema before starting the server.

---

## API Endpoints

### Analyze and Save Profile

```http
POST /api/profile/:username
```

Example:

```http
POST /api/profile/torvalds
```

---

### Get All Profiles

```http
GET /api/profiles
```

---

### Get Single Profile

```http
GET /api/profile/:username
```

Example:

```http
GET /api/profile/torvalds
```

---

## Example Response

```json
{
  "username": "torvalds",
  "followers": 306000,
  "totalStars": 247000,
  "totalForks": 63000,
  "mostUsedLanguage": "C",
  "developerScore": 1350000
}
```

---

## Author

Aryan Koshti
