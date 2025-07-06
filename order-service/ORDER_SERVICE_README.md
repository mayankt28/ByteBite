
# Order Service API Documentation

**Base URL:** `/api/orders`

All responses are in JSON format.  
All endpoints (except test-update) require Authentication (Bearer Token).  

---

## Endpoints

### **POST** `/`  
Place a new order  

**Description:**  
Creates a new order for the authenticated user.

**Authentication:** Required (Bearer Token)  

**Request Body:**  
```json
{
  "restaurantId": "string",
  "items": [
    { "itemId": "string", "quantity": 2 }
  ],
  "totalAmount": 50.00,
  "discount": 5.00,
  "taxAmount": 2.50,
  "paymentMethod": "card | cash",
  "deliveryTime": "2024-07-06T18:00:00Z",
  "priority": "normal | high",
  "source": "mobile | web",
  "deliveryMethod": "pickup | delivery",
  "itemsSubtotal": 42.50,
  "referralCode": "optional",
  "deliveryArea": "optional"
}
```

**Responses:**  
- `201 Created` — Returns order details  
- `400 Bad Request` — Missing or invalid fields  
- `500 Server Error` — Could not place order  

---

### **GET** `/:id`  
Get order by ID  

**Description:**  
Fetch order details for a specific order. Only allows access to orders belonging to the authenticated user.

**Authentication:** Required (Bearer Token)  

**Responses:**  
- `200 OK` — Returns order details  
- `403 Forbidden` — Accessing another user's order  
- `404 Not Found` — Order does not exist  
- `500 Server Error` — Could not fetch order  

---

### **GET** `/`  
Get all orders for user  

**Description:**  
Fetches all orders placed by the authenticated user.

**Authentication:** Required (Bearer Token)  

**Responses:**  
- `200 OK` — Returns array of orders  
- `500 Server Error` — Could not fetch orders  

---

### **PATCH** `/:id/cancel`  
Cancel an order  

**Description:**  
Cancels an order placed by the authenticated user if the order is still in `placed` status.

**Authentication:** Required (Bearer Token)  

**Request Body (optional):**  
```json
{ "cancellationReason": "optional string" }
```

**Responses:**  
- `200 OK` — Order cancelled successfully  
- `400 Bad Request` — Order already cancelled or cannot be cancelled in current status  
- `403 Forbidden` — Accessing another user's order  
- `404 Not Found` — Order does not exist  
- `500 Server Error` — Could not cancel order  

---

### **POST** `/test-update`  
Test WebSocket order update  

**Description:**  
Sends a simulated order status update to a user via WebSocket. Useful for testing.

**Authentication:** Public (for internal use)  

**Request Body:**  
```json
{
  "userId": "string",
  "orderId": "string",
  "status": "new status text"
}
```

**Responses:**  
- `200 OK` — Test update sent successfully  

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

### Place Order
```bash
curl -X POST http://localhost:5002/api/orders/ \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "restaurantId": "rest123",
  "items": [{ "itemId": "item456", "quantity": 2 }],
  "totalAmount": 30,
  "paymentMethod": "card",
  "source": "web",
  "deliveryMethod": "delivery",
  "itemsSubtotal": 25,
  "taxAmount": 2.5
}'
```
