# Rider Provider API Documentation

## Overview
The Rider Provider API is a comprehensive backend service that provides user authentication and management functionality for a ride-sharing application. This API enables users to register accounts, authenticate, manage profiles, and securely log out while maintaining session security through JWT tokens and token blacklisting.

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header or as a cookie for protected endpoints:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. User Registration

#### POST /users/register

**Description:** Register a new user account in the system

**URL:** `/users/register`

**Method:** `POST`

**Content-Type:** `application/json`

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `fullname.firstname` | String | Yes | User's first name | Minimum 3 characters |
| `fullname.lastname` | String | No | User's last name | Minimum 3 characters (if provided) |
| `email` | String | Yes | User's email address | Valid email format, minimum 5 characters |
| `password` | String | Yes | User's password | Minimum 6 characters |

#### Request Body Example
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Response

**Success Response (201 Created)**
```json
{
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "Jo",
      "msg": "First Name should be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

---

### 2. User Login

#### POST /users/login

**Description:** Authenticate an existing user and generate a JWT token

**URL:** `/users/login`

**Method:** `POST`

**Content-Type:** `application/json`

**Authentication:** Not required

#### Request Body

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `email` | String | Yes | User's registered email address | Valid email format, minimum 5 characters |
| `password` | String | Yes | User's password | Minimum 6 characters |

#### Request Body Example
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Response

**Success Response (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

**Error Response (400 Bad Request)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Error Response (401 Unauthorized)**
```json
{
  "message": "Invalid email or password"
}
```

---

### 3. Get User Profile

#### GET /users/profile

**Description:** Retrieve the authenticated user's profile information

**URL:** `/users/profile`

**Method:** `GET`

**Content-Type:** `application/json`

**Authentication:** Required (JWT token)

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Response

**Success Response (200 OK)**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "socketId": null
}
```

**Error Response (401 Unauthorized)**
```json
{
  "message": "Unauthorized"
}
```

---

### 4. User Logout

#### GET /users/logout

**Description:** Logout the authenticated user and invalidate their JWT token

**URL:** `/users/logout`

**Method:** `GET`

**Content-Type:** `application/json`

**Authentication:** Required (JWT token)

#### Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Response

**Success Response (200 OK)**
```json
{
  "message": "Logged out"
}
```

**Error Response (401 Unauthorized)**
```json
{
  "message": "Unauthorized"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| `200` | Request successful |
| `201` | Resource created successfully |
| `400` | Bad request (validation errors) |
| `401` | Unauthorized (invalid or missing token) |
| `500` | Internal server error |

## Data Models

### User Schema
```javascript
{
  fullname: {
    firstname: String (required, min: 3),
    lastname: String (min: 3)
  },
  email: String (required, unique, valid email format, min: 5),
  password: String (required, hashed, select: false),
  socketId: String (optional)
}
```

### Blacklist Token Schema
```javascript
{
  token: String (required, unique),
  createdAt: Date (default: Date.now, expires: 24 hours)
}
```

## Security Features

### Password Security
- Passwords are automatically hashed using bcrypt with 10 salt rounds
- Passwords are never returned in API responses
- Password comparison is done securely using bcrypt

### JWT Authentication
- JWT tokens are generated with a 24-hour expiration time
- Tokens are signed using a secret key stored in environment variables
- Tokens can be sent via Authorization header or cookies

### Token Blacklisting
- Logged out tokens are automatically blacklisted
- Blacklisted tokens expire after 24 hours
- All authenticated requests check against the blacklist

### Input Validation
- Comprehensive validation using express-validator
- Email format validation and uniqueness checking
- String length validation for names and passwords
- Detailed error messages for validation failures

## Error Handling

The API provides consistent error responses with:
- Standardized error message format
- Appropriate HTTP status codes
- Detailed validation error arrays
- Clear authentication error messages

## Usage Examples

### Registration
```javascript
const response = await fetch('/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullname: {
      firstname: 'John',
      lastname: 'Doe'
    },
    email: 'john.doe@example.com',
    password: 'securepassword123'
  })
});
```

### Login
```javascript
const response = await fetch('/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john.doe@example.com',
    password: 'securepassword123'
  })
});
```

### Authenticated Request
```javascript
const response = await fetch('/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
```

## Development Notes

- **Environment Variables:** Ensure `JWT_SECRET_KEY` is set in your environment
- **Database:** MongoDB with Mongoose ODM
- **Session Management:** JWT tokens with automatic blacklisting
- **Real-time Features:** Socket ID support for WebSocket connections
- **Validation:** Server-side validation with express-validator
- **Error Handling:** Comprehensive error handling with appropriate HTTP status codes

## API Versioning

This documentation covers the current version of the Rider Provider API. All endpoints are stable and backward compatible within the current version. 