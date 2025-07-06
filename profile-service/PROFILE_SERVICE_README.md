
# Profile Service API Documentation

**Base URL:** `/api/profile`

All responses are in JSON format.  
All endpoints require Authentication (Bearer Token) and users can only access their own profile via `authorizeUser` middleware.

---

## Endpoints

### **GET** `/:userId`  
Get user profile  

**Description:**  
Fetch profile details for a specific user.

**Authentication:** Required (Bearer Token)  

**Responses:**  
- `200 OK` — Returns profile details  
- `404 Not Found` — Profile does not exist  
- `500 Server Error` — Could not fetch profile  

---

### **PUT** `/:userId`  
Update user profile  

**Description:**  
Update profile details for the authenticated user. Address updates are handled via separate endpoints.

**Authentication:** Required (Bearer Token)  

**Request Body Example:**  
```json
{
  "name": "John Doe",
  "phone": "1234567890"
}
```

**Responses:**  
- `200 OK` — Returns updated profile  
- `500 Server Error` — Could not update profile  

---

### **POST** `/:userId/address`  
Add new address  

**Description:**  
Adds a new address to the user's profile. Setting `isDefault` to true marks this address as default.

**Authentication:** Required (Bearer Token)  

**Request Body:**  
```json
{
  "label": "Home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA",
  "isDefault": true
}
```

**Responses:**  
- `201 Created` — Returns updated profile with new address  
- `404 Not Found` — Profile not found  
- `500 Server Error` — Could not add address  

---

### **PATCH** `/:userId/address/:addressId`  
Update address  

**Description:**  
Updates fields for a specific address. Setting `isDefault` to true marks this address as default.

**Authentication:** Required (Bearer Token)  

**Request Body Example:**  
```json
{
  "label": "Work",
  "city": "San Francisco",
  "isDefault": true
}
```

**Responses:**  
- `200 OK` — Returns updated profile  
- `404 Not Found` — Profile or address not found  
- `500 Server Error` — Could not update address  

---

### **DELETE** `/:userId/address/:addressId`  
Delete address  

**Description:**  
Removes a specific address from the user's profile.

**Authentication:** Required (Bearer Token)  

**Responses:**  
- `200 OK` — Address deleted successfully  
- `404 Not Found` — Profile or address not found  
- `500 Server Error` — Could not delete address  

---

### **PATCH** `/:userId/address/:addressId/default`  
Set default address  

**Description:**  
Marks the specified address as the default address for the user.

**Authentication:** Required (Bearer Token)  

**Responses:**  
- `200 OK` — Returns updated profile with default address set  
- `404 Not Found` — Profile or address not found  
- `500 Server Error` — Could not update default address  

---

# Errors

| Status Code | Meaning                       |
| ----------- | ---------------------------- |
| `200`       | Success                      |
| `201`       | Resource created             |
| `400`       | Bad request (missing fields, invalid input) |
| `403`       | Forbidden (unauthorized access) |
| `404`       | Resource not found           |
| `500`       | Internal server error        |

---

# Example Usage

### Add Address
```bash
curl -X POST http://localhost:5001/api/profile/USER_ID/address \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "label": "Home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA",
  "isDefault": true
}'
```
