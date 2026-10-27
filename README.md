# Student Record Management System (SRMS) 🎓

A full-stack web application designed for college trainers, faculty, and academic staff to efficiently manage student academic profiles, roll numbers, branches, and marks in a centralized dashboard.

Built with **Java Spring Boot (REST API)** on the backend, **React.js** on the frontend, and a persistent embedded **H2 Database** (with zero-configuration setup) and optional **MySQL** compatibility.

---

## 📌 Problem Statement & Solution

Managing student records and evaluation marks manually via spreadsheets or paper logs is prone to human error, data redundancy, and misplaced records. 

The **Student Record Management System (SRMS)** solves this by providing:
- ✅ **Centralized Data Storage**: All records persist safely via Spring Data JPA.
- ✅ **Integrity & Validation**: Enforces uniqueness on student roll numbers and verifies that marks strictly fall between 0 and 100.
- ✅ **Real-Time Search & Metrics**: Instant roll-number lookup and live student statistics (class average, highest score, pass percentage).
- ✅ **Responsive & Intuitive Interface**: Fast, modern UI with inline editing, deletion safeguards, and visual performance indicators.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Add Student** | Register students with Name, Roll Number, Branch, and Marks. Automatically validates input and computes academic grade and pass/fail status. |
| **Display Records Table** | Displays all registered students in an interactive table with roll number badges, initials avatars, progress bars, grades, and quick actions. |
| **Edit Student Details** | In-place modal to modify a student's name, roll number, branch, or marks with validation against duplicate roll numbers. |
| **Delete Student Record** | Safe deletion workflow with an interactive confirmation modal displaying the target student's name and roll number. |
| **Search by Roll Number** | Dedicated search bar to instantly query students by exact or partial roll number (e.g., `24EG105D24`), with a one-click clear button. |
| **Total Registered Counter** | Live metrics banner displaying the total number of enrolled students, class average, top mark, and passing rate. |
| **Branch Filtering & Export** | Filter table by department/branch and export current student records to CSV with one click. |

---

## 🛠️ Technology Stack

- **Backend**: Java 17, Spring Boot 3.3.4, Spring Data JPA, Hibernate Validator, Maven
- **Frontend**: React.js 18, Vite, Axios, Lucide React (Icons), Modern CSS3
- **Database**:
  - **Primary (Default)**: Embedded **H2 Database** with file-based persistence (`./data/srmsdb`).
  - **Alternative**: **MySQL 8.x** (pre-configured JDBC driver included).
- **Testing**: JUnit 5, Spring Boot Test, MockMvc (100% test coverage for all endpoints and validation rules).

---

## 🗄️ Database Choice & Setup Instructions

### Why H2 File-Based Database Was Chosen
1. **Zero External Dependencies**: Anyone reviewing or cloning this repository can clone and run it immediately without needing to install, configure, or start a local MySQL/PostgreSQL server.
2. **File Persistence**: Unlike pure in-memory databases that wipe data on shutdown, SRMS stores database files in `./data/srmsdb.mv.db`, ensuring all added, updated, or deleted records remain intact across application restarts.
3. **Built-in H2 Web Console**: Includes an interactive web console for database inspection at `http://localhost:8080/h2-console`.

### 1. Default Setup (H2 Embedded - Recommended)
No configuration required! The database initializes automatically on the first run.
- **JDBC URL**: `jdbc:h2:file:./data/srmsdb;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE`
- **Username**: `sa`
- **Password**: *(leave blank)*
- **H2 Console URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

### 2. Optional Setup (MySQL)
If you prefer running against an external MySQL instance:
1. Create a MySQL database:
   ```sql
   CREATE DATABASE srms_db;
   ```
2. In `backend/src/main/resources/application.properties`, comment out the H2 lines and configure MySQL:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/srms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   spring.jpa.hibernate.ddl-auto=update
   ```

---

## 📡 REST API Documentation

Base URL: `http://localhost:8080/api/students`

| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/students` | Register a new student | `{ "name": "...", "rollNumber": "...", "branch": "...", "marks": 85.5 }` | `201 Created` / `400 Bad Request` / `409 Conflict` |
| **GET** | `/api/students` | Get all students (or filter by `?rollNumber=...`) | *None* | `200 OK` |
| **GET** | `/api/students/{id}` | Get student by database ID | *None* | `200 OK` / `404 Not Found` |
| **GET** | `/api/students/search` | Search students by roll number query (`?rollNumber=...`) | *None* | `200 OK` |
| **PUT** | `/api/students/{id}` | Update existing student details | `{ "name": "...", "rollNumber": "...", "branch": "...", "marks": 90.0 }` | `200 OK` / `400 Bad Request` / `409 Conflict` |
| **DELETE** | `/api/students/{id}` | Delete a student record | *None* | `200 OK` (`{ success: true, message: "..." }`) |
| **GET** | `/api/students/count` | Get total count of registered students | *None* | `200 OK` (`{ totalStudents: 6 }`) |
| **GET** | `/api/students/stats` | Get class analytics (avg marks, pass rate, top mark) | *None* | `200 OK` |

### Input Validation Rules
- **Student Name**: Required, 2 to 100 characters.
- **Roll Number**: Required, alphanumeric, unique across all students (returns `409 Conflict` if duplicated).
- **Branch**: Required (e.g. `Computer Science & Engineering`).
- **Marks**: Required, numeric, strictly between `0.0` and `100.0` (returns `400 Bad Request` if invalid).

---

## 💻 Running the Application Locally

### Prerequisites
- **Java**: JDK 17 or higher
- **Maven**: 3.8+ (or use `mvn`)
- **Node.js**: v18+ and `npm`

### 1. Clone the Repository
```bash
git clone https://github.com/24eg105d24-bit/SRMS.git
cd SRMS
```

### 2. Start the Spring Boot Backend
Open a terminal in the root directory:
```bash
cd backend
mvn clean spring-boot:run
```
The REST API will start at **`http://localhost:8080`**.
- H2 Web Console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- Pre-seeded with sample student records for immediate evaluation!

### 3. Start the React Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
The React application will launch at **`http://localhost:5173`**.

---

## 🧪 Running Automated Tests

Run the full backend test suite covering CRUD operations, validations, and duplicate checks:
```bash
cd backend
mvn test
```
All 9 automated integration tests will execute against an in-memory database instance.

---

## 📂 Project Directory Structure

```
SRMS/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/srms/studentmanagement/
│   │   │   │   ├── config/              # CORS and DataInitializer runner
│   │   │   │   ├── controller/          # StudentController (REST endpoints)
│   │   │   │   ├── dto/                 # Request/Response/Stats DTOs
│   │   │   │   ├── exception/           # GlobalExceptionHandler & custom exceptions
│   │   │   │   ├── model/               # Student JPA Entity
│   │   │   │   ├── repository/         # StudentRepository (JPA queries)
│   │   │   │   └── service/            # StudentService & implementation
│   │   │   └── resources/
│   │   │       └── application.properties # Server & DB config
│   │   └── test/                        # MockMvc Integration tests
│   └── pom.xml                          # Maven build file
├── frontend/
│   ├── src/
│   │   ├── components/                  # Header, StatsCards, SearchBar, Table, Modals, Toast
│   │   ├── services/                    # Axios API client & studentService
│   │   ├── App.jsx                      # Main application component
│   │   └── index.css                    # Professional responsive stylesheet
│   ├── package.json
│   └── vite.config.js                   # Vite config with API proxy
├── .gitignore
└── README.md
```

---

## 👤 Author
- **Developer**: Jalaja Sindhu Nori
- **GitHub**: [@24eg105d24-bit](https://github.com/24eg105d24-bit)
- **Repository**: [https://github.com/24eg105d24-bit/SRMS.git](https://github.com/24eg105d24-bit/SRMS.git)
