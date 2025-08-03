# User Registration API Documentation

## Overview
This API provides user registration functionality for the rider provider application. Users can create new accounts with their personal information.

## Endpoints

### POST /users/register

**Description:** Register a new user account

**URL:** `/users/register`

**Method:** `POST`

**Content-Type:** `application/json`

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

#### Status Codes

| Code | Description |
|------|-------------|
| `201` | User created successfully |
| `400` | Validation error or missing required fields |
| `500` | Internal server error |

#### Validation Rules

1. **Email Validation:**
   - Must be a valid email format
   - Must be at least 5 characters long
   - Must be unique (not already registered)

2. **First Name Validation:**
   - Required field
   - Must be at least 3 characters long

3. **Last Name Validation:**
   - Optional field
   - If provided, must be at least 3 characters long

4. **Password Validation:**
   - Required field
   - Must be at least 6 characters long
   - Will be hashed using bcrypt before storage

#### Additional Information

- **Password Security:** Passwords are automatically hashed using bcrypt with a salt rounds of 10 before being stored in the database
- **JWT Token:** Upon successful registration, a JWT token is generated with a 1-day expiration time
- **Email Uniqueness:** The system ensures email addresses are unique across all users
- **Database Schema:** User data is stored in MongoDB using Mongoose schema with proper indexing on the email field
- **Error Handling:** Comprehensive validation using express-validator with detailed error messages

#### Usage Example

```javascript
// Using fetch API
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

const data = await response.json();
```

#### Notes for Developers

- The API automatically handles password hashing and JWT token generation
- Store the returned JWT token securely for subsequent authenticated requests
- The `socketId` field is available for real-time communication features
- All validation errors are returned in a standardized format for easy client-side handling 