
# Review Service API Documentation

**Base URL:** `/api/reviews`

All responses are JSON formatted.
Authentication required (`protect` middleware) for create, edit, and delete operations.

---

## Endpoints

### POST `/`

Create a new review for a menu item.

**Headers:**
`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "menuItemId": "string",
  "rating": number,
  "comment": "string"
}
```

**Responses:**

* `201 Created` — Review added successfully
* `500 Internal Server Error` — Error creating review

---

### GET `/menu-items`

Batch fetch review summaries for multiple menu items.

**Query Parameters:**

* `ids` (comma-separated menu item IDs) — e.g. `ids=abc123,def456`

**Response:**

```json
{
  "reviews": {
    "menuItemId1": {
      "averageRating": number,
      "totalReviews": number,
      "recentComments": ["string", "string", ...]
    },
    ...
  }
}
```

**Responses:**

* `200 OK` — Returns review summaries
* `500 Internal Server Error` — Error fetching reviews

---

### GET `/menu-item/:menuItemId`

Fetch detailed reviews for a specific menu item.

**Response:**

```json
{
  "reviews": [
    {
      "_id": "string",
      "menuItemId": "string",
      "userId": "string",
      "rating": number,
      "comment": "string",
      "createdAt": "ISODate",
      ...
    },
    ...
  ]
}
```

**Responses:**

* `200 OK` — Returns array of reviews
* `500 Internal Server Error` — Error fetching reviews

---

### PUT `/:reviewId`

Edit an existing review. Only the author can edit.

**Headers:**
`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "rating": number,       // optional
  "comment": "string"     // optional
}
```

**Responses:**

* `200 OK` — Review updated successfully
* `403 Forbidden` — Not authorized to edit
* `404 Not Found` — Review not found
* `500 Internal Server Error` — Error updating review

---

### DELETE `/:reviewId`

Delete an existing review. Only the author can delete.

**Headers:**
`Authorization: Bearer <token>`

**Responses:**

* `200 OK` — Review deleted successfully
* `403 Forbidden` — Not authorized to delete
* `404 Not Found` — Review not found
* `500 Internal Server Error` — Error deleting review

---

## Error Codes Summary

| Status Code | Meaning                         |
| ----------- | ------------------------------- |
| 200         | Success                         |
| 201         | Resource created                |
| 403         | Forbidden (authorization error) |
| 404         | Resource not found              |
| 500         | Internal server error           |

---


