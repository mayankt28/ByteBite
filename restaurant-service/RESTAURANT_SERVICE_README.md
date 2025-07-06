
# Restaurant Service API Documentation

**Base URL:** `/api/restaurant`

All responses are in JSON format.
Role-based access (`admin` or `restaurant employee`) required for management endpoints.

---

## Restaurant Management Endpoints

### **GET** `/:restaurantId`

Get restaurant details

**Access:** Public

**Responses:**

* `200 OK` — Returns restaurant details
* `404 Not Found` — Restaurant not found

---

### **POST** `/`

Create a new restaurant

**Access:** `Admin` or `Restaurant Employee`

**Request Body:**

```json
{
  "name": "string",
  "address": "string",
  "description": "string",
  "categories": ["string"]
}
```

**Responses:**

* `201 Created` — Restaurant created
* `400 Bad Request` — Missing required fields
* `500 Server Error` — Failed to create restaurant

---

### **PUT** `/:id`

Update restaurant

**Access:** `Admin` or `Restaurant Employee`

**Responses:**

* `200 OK` — Restaurant updated
* `404 Not Found` — Restaurant not found
* `500 Server Error` — Failed to update restaurant

---

### **DELETE** `/:id`

Soft delete restaurant

**Access:** `Admin` or `Restaurant Employee`

**Responses:**

* `200 OK` — Restaurant deleted
* `404 Not Found` — Restaurant not found
* `500 Server Error` — Failed to delete restaurant

---

### **GET** `/`

Get all restaurants

**Access:** Public

**Responses:**

* `200 OK` — Returns array of restaurants (menu excluded)
* `500 Server Error` — Failed to fetch restaurants

---

## Menu Management Endpoints

### **POST** `/:restaurantId/menu`

Add menu item (with optional image)

**Access:** `Admin` or `Restaurant Employee`

**Form Data:**

* `name` (required)
* `price` (required)
* `description` (optional)
* `image` (file, optional)

**Responses:**

* `201 Created` — Item added
* `400 Bad Request` — Missing or invalid fields
* `404 Not Found` — Restaurant not found
* `500 Server Error` — Failed to add item

---

### **PUT** `/:restaurantId/menu/:itemId`

Update menu item

**Access:** `Admin` or `Restaurant Employee`

**Form Data:**

* `name` (optional)
* `price` (optional)
* `image` (file, optional)

**Responses:**

* `200 OK` — Item updated
* `404 Not Found` — Restaurant or item not found
* `500 Server Error` — Failed to update item

---

### **DELETE** `/:restaurantId/menu/:itemId`

Soft delete menu item

**Access:** `Admin` or `Restaurant Employee`

**Responses:**

* `200 OK` — Item deleted
* `404 Not Found` — Restaurant or item not found
* `500 Server Error` — Failed to delete item

---

### **GET** `/:restaurantId/menu`

Get active menu items

**Access:** Public

**Responses:**

* `200 OK` — Returns array of active menu items
* `404 Not Found` — Restaurant not found
* `500 Server Error` — Failed to fetch menu

---

## Order Management Endpoints (Restaurant Panel)

**Base URL:** `/api/orders`

---

### **GET** `/?restaurantId=xyz`

Get pending orders (status `placed` or `preparing`)

**Access:** `Admin` or `Restaurant Employee`

**Responses:**

* `200 OK` — Returns array of pending orders
* `400 Bad Request` — Missing `restaurantId`
* `500 Server Error` — Failed to fetch orders

---

### **PUT** `/:orderId`

Update order status (`preparing`, `ready`, `completed`)

**Access:** `Admin` or `Restaurant Employee`

**Request Body:**

```json
{ "status": "preparing | ready | completed" }
```

**Responses:**

* `200 OK` — Order updated
* `400 Bad Request` — Invalid status
* `404 Not Found` — Order not found
* `500 Server Error` — Failed to update order

---

## Error Codes

| Status | Meaning                             |
| ------ | ----------------------------------- |
| `200`  | Success                             |
| `201`  | Resource created                    |
| `400`  | Bad request (missing/invalid input) |
| `403`  | Forbidden (unauthorized access)     |
| `404`  | Resource not found                  |
| `500`  | Internal server error               |

---

## Example Usage

### Add Menu Item with Image (cURL)

```bash
curl -X POST http://localhost:5003/api/restaurant/REST_ID/menu \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
-F "name=Burger" -F "price=10.99" -F "image=@/path/to/image.jpg"
```

---

