
# Auth Service API Documentation

**Base URL:** `/api/auth`

All responses are in JSON format.  
Secure cookies (`refreshToken`) are used for session management.

---

## Endpoints

### **POST** `/register`  
Register a new user  

**Description:**  
Creates a new user account. If the role is `employee` or `manager`, `restaurantId` is required.

**Request Body:**  
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourPassword123",
  "role": "user | employee | manager",
  "restaurantId": "optional for employees/managers only"
}
```

**Responses:**  
- `201 Created`  
```json
{ "msg": "User registered successfully" }
```
- `400 Bad Request`  
```json
{ "msg": "Email already exists" }
```
- `500 Server Error`  
```json
{ "msg": "Server error", "error": "Error details" }
```

**Authentication:** Public  

---

### **POST** `/login`  
User login  

**Description:**  
Authenticates user credentials, issues `accessToken`, and sets `refreshToken` cookie.

**Request Body:**  
```json
{
  "email": "john@example.com",
  "password": "yourPassword123"
}
```

**Responses:**  
- `200 OK`  
```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user | employee | manager",
    "restaurantId": "included for employees/managers only"
  }
}
```
✅ `refreshToken` is stored as an **HTTP-Only Secure Cookie**  

- `400 Bad Request`  
```json
{ "msg": "Invalid credentials" }
```
- `500 Server Error`  
```json
{ "msg": "Server error", "error": "Error details" }
```

**Authentication:** Public  

---

### **POST** `/refresh`  
Refresh access token  

**Description:**  
Validates refresh token from cookies and issues a new access token.

**Request:**  
No body required. Expects `refreshToken` cookie to be present.

**Responses:**  
- `200 OK`  
```json
{ "accessToken": "new-jwt-access-token" }
```
- `401 Unauthorized`  
```json
{ "msg": "No refresh token provided" }
```
- `403 Forbidden`  
```json
{ "msg": "Invalid token" }
```
- `404 Not Found`  
```json
{ "msg": "User not found" }
```

**Authentication:** Requires valid `refreshToken` cookie  

---

### **POST** `/logout`  
User logout  

**Description:**  
Clears the refresh token from Redis and browser cookies.

**Request:**  
No body required. Uses `refreshToken` cookie for identification.

**Responses:**  
- `200 OK`  
```json
{ "msg": "Logged out successfully" }
```

**Notes:**  
Even if token clearing fails, cookie is removed for client security.

**Authentication:** Requires valid `refreshToken` cookie (if present)

---

# Token Details

| Token Type    | Storage              | Expiration |
| ------------- | ------------------- | ----------- |
| Access Token  | Returned in response | 15 minutes  |
| Refresh Token | Secure HTTP-Only Cookie | 7 days |

---

# Errors

| Status Code | Meaning                       |
| ----------- | ---------------------------- |
| `200`       | Success                      |
| `201`       | Resource created             |
| `400`       | Bad request (missing fields, invalid input) |
| `401`       | Unauthorized (missing token) |
| `403`       | Forbidden (invalid token)    |
| `404`       | Resource not found           |
| `500`       | Internal server error        |

---

# Example Usage

### Registration
```bash
curl -X POST http://localhost:5006/api/auth/register -H "Content-Type: application/json" -d '{"name": "John", "email": "john@example.com", "password": "pass123", "role": "user"}'
```
