# Analytics Service API Documentation

**Base URL:** `/api/analytics`

All responses are JSON formatted.
Access to all endpoints is protected by the `checkAnalyticsAccess` middleware.

---

## User Analytics

### GET `/users/summary`

Get overall user analytics summary.

**Response:**

```json
{
  // Object containing user analytics data
}
```

---

### GET `/users/growth`

Get daily user registration growth data.

**Response:**

```json
[
  // Array of daily registrations data points
]
```

---

## Order Analytics

### GET `/orders/summary`

Get order summary statistics (platform-wide).

### GET `/orders/:restaurantId/summary`

Get order summary statistics for a specific restaurant.

**Query Parameters:**

* `date` (optional) — filter by specific date (e.g. `2025-07-06`)

**Response:**

```json
[
  // Array of order analytics objects
]
```

---

### GET `/orders/timeseries`

Get timeseries data of orders (platform-wide).

### GET `/orders/:restaurantId/timeseries`

Get timeseries data of orders for a specific restaurant.

**Response:**

```json
[
  // Array of order analytics sorted by date ascending
]
```

---

### GET `/orders/referrals`

Get total referral count (platform-wide).

### GET `/orders/:restaurantId/referrals`

Get total referral count for a specific restaurant.

**Response:**

```json
{
  "totalReferrals": number
}
```

---

### GET `/orders/delivery-areas`

Get delivery area statistics (platform-wide).

### GET `/orders/:restaurantId/delivery-areas`

Get delivery area statistics for a specific restaurant.

**Response:**

```json
{
  "areaName": count,
  ...
}
```

---

## Review Analytics

### GET `/reviews/summary`

Get review summary. If `restaurantId` is provided, returns summary for that restaurant; otherwise, platform-wide.

### GET `/reviews/:restaurantId/summary`

Get review summary for a specific restaurant.

**Response:**

```json
{
  "totalReviews": number,
  "averageRating": number,
  ...
}
```

---

### GET `/reviews/:restaurantId/rating-distribution`

Get rating distribution for a specific restaurant.

**Response:**

```json
{
  // e.g., "5 stars": count, "4 stars": count, ...
}
```

---

### GET `/reviews/top-rated-items`

Get top 10 rated menu items platform-wide.

**Response:**

```json
[
  {
    "menuItemId": "string",
    "averageRating": number,
    "totalReviews": number,
    ...
  },
  ...
]
```

---

## Restaurant Performance Analytics

### GET `/restaurants/top`

Get top 5 restaurants by total revenue and average rating.

### GET `/restaurants/low-rated`

Get bottom 5 restaurants by average rating.

**Response:**

```json
[
  {
    "restaurantId": "string",
    "totalRevenue": number,
    "averageRating": number,
    ...
  },
  ...
]
```

---

## Error Codes Summary

| Status Code | Meaning                                     |
| ----------- | ------------------------------------------- |
| 200         | Success                                     |
| 400         | Bad Request (missing or invalid parameters) |
| 401         | Unauthorized (missing/invalid access)       |
| 403         | Forbidden (no access permission)            |
| 500         | Internal Server Error                       |

---


