# Student Management System API

A simple REST API for student management built using Node.js, Express, and in-memory storage.

## Features

- Complete CRUD operations for student records
- RESTful API design
- Validation for student data
- Proper error handling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students` | Create a new student |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get a specific student by ID |
| PUT | `/api/students/:id` | Update a student by ID |
| DELETE | `/api/students/:id` | Delete a student by ID |

## API Operations in Postman

Below are screenshots of each API operation tested in a Postman-like interface:

### 1. Create Student (POST)

**Postman Request:**

```
POST http://localhost:5000/api/students
Content-Type: application/json

{
  "name": "John Smith",
  "rollNumber": "R2001",
  "email": "john.smith@example.com",
  "mobile": "9876543210"
}
```

**Response:**
```
Status: 201 Created

{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "name": "John Smith",
    "rollNumber": "R2001",
    "email": "john.smith@example.com",
    "mobile": "9876543210",
    "id": 4
  }
}
```

![POST Create Student](https://i.imgur.com/ZEj9OFC.png)

### 2. Get All Students (GET)

**Postman Request:**

```
GET http://localhost:5000/api/students
```

**Response:**
```
Status: 200 OK

{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "rollNumber": "R1001",
      "email": "alice.johnson@example.com",
      "mobile": "1234567890"
    },
    {
      "id": 2,
      "name": "Bob Williams",
      "rollNumber": "R1002",
      "email": "bob.williams@example.com",
      "mobile": "2345678901"
    },
    {
      "id": 3,
      "name": "Charlie Brown",
      "rollNumber": "R1003",
      "email": "charlie.brown@example.com",
      "mobile": "3456789012"
    },
    {
      "id": 4,
      "name": "John Smith",
      "rollNumber": "R2001",
      "email": "john.smith@example.com",
      "mobile": "9876543210"
    }
  ]
}
```

![GET All Students](https://i.imgur.com/m7v5ATF.png)

### 3. Get Student by ID (GET)

**Postman Request:**

```
GET http://localhost:5000/api/students/4
```

**Response:**
```
Status: 200 OK

{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "id": 4,
    "name": "John Smith",
    "rollNumber": "R2001",
    "email": "john.smith@example.com",
    "mobile": "9876543210"
  }
}
```

![GET Student by ID](https://i.imgur.com/3BWnZX2.png)

### 4. Update Student (PUT)

**Postman Request:**

```
PUT http://localhost:5000/api/students/4
Content-Type: application/json

{
  "name": "John Smith Updated",
  "rollNumber": "R2001",
  "email": "john.updated@example.com",
  "mobile": "9876543210"
}
```

**Response:**
```
Status: 200 OK

{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "name": "John Smith Updated",
    "rollNumber": "R2001",
    "email": "john.updated@example.com",
    "mobile": "9876543210",
    "id": 4
  }
}
```

![PUT Update Student](https://i.imgur.com/RYqgPkw.png)

### 5. Delete Student (DELETE)

**Postman Request:**

```
DELETE http://localhost:5000/api/students/4
```

**Response:**
```
Status: 200 OK

{
  "success": true,
  "message": "Student deleted successfully"
}
```

![DELETE Student](https://i.imgur.com/7ajKUAW.png)

## Installation

1. Clone the repository:
```
git clone https://github.com/Mohammedshahinsha/Backend-simpleCRUD.git
```

2. Navigate to the project directory:
```
cd Backend-simpleCRUD
```

3. Install dependencies:
```
npm install
```

4. Start the server:
```
npm run dev
```

5. The API will be available at `http://localhost:5000/api`

## Project Structure

```
.
├── client                  # Frontend code
│   └── src
│       ├── components      # React components
│       ├── hooks           # Custom React hooks
│       ├── lib             # Utility functions
│       ├── pages           # Page components
│       └── App.tsx         # Main application component
├── server                  # Backend code
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage implementation
│   └── vite.ts             # Vite configuration
├── shared                  # Shared code between frontend and backend
│   └── schema.ts           # Data schema definitions
├── screenshots             # API response screenshots
└── README.md
```

## Student Model

```typescript
{
  id: number,
  name: string,
  rollNumber: string,
  email: string,
  mobile: string
}
```

## Technologies Used

- Node.js
- Express
- TypeScript
- React
- Vite
- Tailwind CSS
- Shadcn UI
- React Query