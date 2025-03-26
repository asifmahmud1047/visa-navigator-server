# Visa Navigator Server

A robust backend server for the Visa Navigator Portal that simplifies the process of checking visa requirements, applying for visas online, and tracking applications.

## Features

- 🔐 Secure user authentication with JWT
- 🌍 Comprehensive visa information management
- 📝 Online visa application system
- 🔍 Advanced search and filtering capabilities
- 👤 User-specific visa management
- 📊 Application tracking system

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/visa-navigator-server.git
cd visa-navigator-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile

### Visas
- GET `/api/visas` - Get all visas (with optional filtering)
- GET `/api/visas/:id` - Get single visa details
- POST `/api/visas` - Add new visa (protected)
- PUT `/api/visas/:id` - Update visa (protected)
- DELETE `/api/visas/:id` - Delete visa (protected)
- GET `/api/visas/user/visas` - Get user's added visas (protected)

### Applications
- POST `/api/applications` - Apply for a visa (protected)
- GET `/api/applications/my-applications` - Get user's applications (protected)
- DELETE `/api/applications/:id` - Cancel application (protected)
- GET `/api/applications/search` - Search applications by country (protected)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes
- Rate limiting
- CORS enabled

## Error Handling

The API includes comprehensive error handling for:
- Invalid input data
- Authentication failures
- Database errors
- Not found resources
- Unauthorized access

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 