# StarkTasks Backend

The StarkTasks Backend is a Node.js application built with Express and MongoDB for managing tasks with user authentication. It serves as the backend for the StarkTasks frontend application, providing RESTful API endpoints for task management and user authentication.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Middlewares](#middlewares)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure user registration and login using JWT tokens.
- **Task Management**: Create, read, update, and delete tasks with role-based access.
- **Database Interaction**: Utilizes MongoDB for data storage, allowing for efficient data management.
- **CORS Support**: Enables cross-origin requests to allow communication between the frontend and backend.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB, providing a schema-based solution to model data.
- **jsonwebtoken**: For handling JWT authentication.
- **bcryptjs**: For password hashing.
- **dotenv**: For managing environment variables.
- **cors**: For enabling CORS in the application.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Harshdev625/StarkTasks-Backend
   cd StarkTasks-Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables (e.g., MongoDB connection string, JWT secret):

   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the application in development mode:

   ```bash
   nodemon
   ```

5. The server will run on the specified port (default: 5000). You can access it at `http://localhost:5000`.

## Usage

1. **User Registration**: Use the `/api/auth/register` endpoint to register new users.
2. **User Login**: Use the `/api/auth/login` endpoint to authenticate users and obtain a JWT.
3. **Task Management**: Use the provided API endpoints to manage tasks based on user roles (admin and user).

## API Endpoints

The following endpoints are available for use:

- **Authentication**:
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in a user and return a token.
  - `GET /api/auth/:id`: Get user details by ID.

- **Tasks** (Admin-only):
  - `POST /api/tasks`: Create a new task.
  - `PATCH /api/tasks/:id`: Update an existing task.
  - `DELETE /api/tasks/:id`: Delete a task.
  - `GET /api/tasks`: Fetch all tasks.
  - `GET /api/tasks/:id`: Get task details by ID.
  - `PATCH /api/tasks/:id/complete`: Mark a task as completed.
  - `GET /api/fetchallusers`: Fetch all users (admin-only).

## Middlewares

- **Authentication Middleware**: Ensures that the user is authenticated by checking the presence and validity of a JWT token.
- **Admin Middleware**: Ensures that only users with admin privileges can access certain routes related to task management and user fetching.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

---

Feel free to make any further adjustments or add additional information as needed!