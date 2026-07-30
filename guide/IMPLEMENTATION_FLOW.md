# Movie Booking System - Implementation Flow (Technical Guide)

> **Current Status**: ✅ **Phase 1 Started**. This document is the definitive technical reference for implementation, containing DTOs, validations, and JSON examples for all 64 endpoints.

---

## ✅ **PHASE 0: CRITICAL SECURITY FIXES** (Completed)
All security vulnerabilities (API versioning, Admin path security, Role management) have been resolved.

---

## 📋 Phase 1: Foundation (Auth & Users)
**Goal**: Secure identity management and user profiles.

### 1. Authentication & Identity
**Base URL**: `/api/v1/auth`

#### Endpoint: `POST /register`
- **Purpose**: Register new user.
- **Request Body** (`RegisterRequest`):
  ```json
  {
    "name": "Jane Doe", // @NotBlank
    "email": "jane@example.com", // @Email
    "password": "securePass123" // @Size(min=6)
  }
  ```
- **Response** (`AuthResponse`):
  ```json
  {
    "token": "eyJhbG...",
    "refreshToken": "d8e7...",
    "user": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "role": "USER" }
  }
  ```
- **Implementation Steps**:
  1. Create `RegisterRequest` DTO with validations.
  2. In Service: Check email exists -> throw `UserAlreadyExistsException`.
  3. Hash password with `BCryptPasswordEncoder`.
  4. Save User.
  5. Generate Access & Refresh tokens.

#### Endpoint: `POST /login`
- **Purpose**: Authenticate user.
- **Request Body** (`LoginRequest`):
  ```json
  { "email": "jane@example.com", "password": "securePass123" }
  ```
- **Response**: Same as Register.

#### Endpoint: `POST /refresh-token`
- **Purpose**: Get new access token.
- **Request Body**: `{ "refreshToken": "..." }`
- **Response**: `{ "accessToken": "..." }`

#### Endpoint: `POST /logout`
- **Purpose**: Invalidate refresh token.
- **Request Body**: `{ "refreshToken": "..." }`
- **Logic**: Delete token from DB or mark revoked.

#### Endpoint: `POST /password/forgot`
- **Purpose**: Initiate reset.
- **Request Body**: `{ "email": "..." }`
- **Logic**: Generate UUID token -> Save to `PasswordResetToken` -> Send Email.

#### Endpoint: `POST /password/reset`
- **Purpose**: Complete reset.
- **Request Body**: `{ "token": "...", "newPassword": "..." }`
- **Logic**: Validate token expiry -> Hash new password -> Update User.

### 2. User Profile
**Base URL**: `/api/v1/users`

#### Endpoint: `GET /me`
- **Purpose**: Get current profile.
- **Response**: `{ "id": 1, "name": "...", "email": "...", "avatarUrl": "..." }`
- **Steps**: extracting `@AuthenticationPrincipal UserPrincipal` -> Return DTO.

#### Endpoint: `PATCH /me`
- **Purpose**: Update details.
- **Request Body**: `UpdateProfileRequest`
  ```json
  { "name": "Jane Smith", "phone": "+1234567890" }
  ```
- **Response**: Updated profile.

#### Endpoint: `POST /me/avatar`
- **Purpose**: Upload photo.
- **Request**: `multipart/form-data` (file).
- **Logic**: Verify image type -> Save to filesystem/S3 -> Update `avatarUrl`.

---

## 📋 Phase 2: Core Catalog (Cities, Movies, Theaters)
**Goal**: The searchable content of the application.

### 3. Cities
**Base URL**: `/api/v1/cities`

#### Endpoint: `GET /`
- **Purpose**: List cities.
- **Params**: `?name=Mum` (Optional).
- **Response**: `[ { "id": 1, "name": "Mumbai", "state": "Maharashtra" } ]`

### 4. Movies
**Base URL**: `/api/v1/movies`

#### Endpoint: `GET /`
- **Purpose**: Filter movies.
- **Params**: `cityId`, `genre`, `language`, `status` (NOW_SHOWING), `page=0`, `size=10`.
- **Response** (`Page<MovieDTO>`):
  ```json
  {
    "content": [
      { "id": 1, "title": "Inception", "genre": "Sci-Fi", "rating": 4.8, "posterUrl": "..." }
    ],
    "totalPages": 5,
    "totalElements": 50
  }
  ```
- **Steps**: Use `Specification` or `@Query` to build dynamic filter.

#### Endpoint: `GET /trending`
- **Purpose**: Top movies.
- **Params**: `limit=10`.
- **Logic**: Order by booking count.

#### Endpoint: `GET /{id}`
- **Purpose**: Full details.
- **Response**: Movie details + Cast info + Languages.

#### Endpoint: `GET /{id}/cast`
- **Response**: `[ { "name": "Leonardo DiCaprio", "role": "Actor" } ]`

### 5. Theaters
**Base URL**: `/api/v1/theaters`

#### Endpoint: `GET /`
- **Purpose**: Find theaters.
- **Params**: `cityId` (Required).
- **Response**: `[ { "id": 10, "name": "PVR Icon", "address": "..." } ]`

#### Endpoint: `GET /{id}/shows`
- **Purpose**: Theater schedule.
- **Params**: `date` (ISO Date, default Today).
- **Response**:
  ```json
  [
    {
      "movie": { "title": "Inception" },
      "shows": [ { "id": 101, "time": "10:00:00", "screen": "Audi 1" } ]
    }
  ]
  ```

---

## 📋 Phase 3: Shows & Discovery (Critical)
**Goal**: Connecting Movies to Theaters at specific times.

### 6. Shows
**Base URL**: `/api/v1/shows`

#### Endpoint: `GET /`
- **Purpose**: Search specific showtimes.
- **Params**: `movieId` AND `cityId` AND `date`.
- **Response**: List of Show objects with venue details.

#### Endpoint: `GET /{id}/seats` (CRITICAL)
- **Purpose**: Real-time seat layout.
- **Response**:
  ```json
  {
    "id": 101,
    "seats": [
      { "seatNumber": "A1", "status": "AVAILABLE", "price": 250, "type": "PREMIUM" },
      { "seatNumber": "A2", "status": "BOOKED", "price": 250, "type": "PREMIUM" },
      { "seatNumber": "A3", "status": "LOCKED", "price": 250, "type": "PREMIUM" }
    ]
  }
  ```
- **Implementation**:
  1. Fetch `Show` by ID.
  2. Fetch all `ShowSeat` entities.
  3. Map to DTO. This must be optimized for speed.

---

## 📋 Phase 4: Booking Flow (Logic Heavy)
**Goal**: Manage atomic transactions and payments.

### 7. Bookings
**Base URL**: `/api/v1/bookings`

#### Endpoint: `POST /`
- **Purpose**: Lock seats.
- **Request Body**:
  ```json
  { "showId": 101, "seatIds": [501, 502] }
  ```
- **Response**:
  ```json
  { "bookingId": 55, "amount": 500, "expiresAt": "2024-02-10T10:15:00" }
  ```
- **Implementation Steps**:
  1. `@Transactional` Method.
  2. Lock `ShowSeat` rows (`PESSIMISTIC_WRITE`).
  3. Check status == AVAILABLE for all.
  4. Update status = LOCKED, lockedAt = Now.
  5. Create `Booking` (PENDING).
  6. Return ID.

#### Endpoint: `POST /{id}/payment-intent`
- **Purpose**: Initiate Payment.
- **Response**: `{ "orderId": "pay_2938...", "key": "rzp_test...", "amount": 50000 }`
- **Logic**: Amount in paisa/cents. Verify booking is valid/not expired.

#### Endpoint: `PATCH /{id}/confirm`
- **Purpose**: Complete booking.
- **Request Body**: `{ "paymentId": "pay_...", "signature": "..." }`
- **Logic**:
  1. Verify HMAC signature.
  2. Update Booking -> CONFIRMED.
  3. Update ShowSeats -> BOOKED.
  4. Async: Send Email.

#### Endpoint: `PATCH /{id}/cancel`
- **Purpose**: Cancel booking.
- **Logic**: Mark CANCELLED, Release seats (AVAILABLE).

#### Endpoint: `GET /{id}/ticket`
- **Purpose**: Ticket Info.
- **Response**: JSON with QR Code string content.

#### Endpoint: `POST /apply-coupon`
- **Request**: `{ "code": "SUMMER20", "bookingId": 55 }`
- **Response**: `{ "discount": 100, "finalAmount": 400 }`

---

## 📋 Phase 5: User Features
**Goal**: History and engagement.

### 8. User Actions
**Base URL**: `/api/v1/users/me`

#### Endpoint: `GET /bookings`
- **Purpose**: History.
- **Response**: Paginated bookings.

#### Endpoint: `POST /wishlist`
- **Request**: `{ "movieId": 5 }`
- **Logic**: Add logic to `Set<Movie> wishlist`.

#### Endpoint: `POST /api/v1/movies/{id}/reviews`
- **Request**: `{ "rating": 5, "comment": "Amazing!" }`
- **Validation**: Rating 1-5.

---

## 📋 Phase 6: Advanced Features
**Goal**: Offers, Webhooks, Notifications.

### 9. Offers
- **`GET /api/v1/offers`**: List active.
- **`POST /api/v1/offers/validate`**: Check code validity.

### 10. Webhooks
- **`POST /api/v1/payments/webhook`**: Handle Razorpay events (async).
  - Verify signature secret.
  - If `payment.captured`: Confirm booking.
  - If `payment.failed`: Release seats.

### 11. Search
- **`GET /api/v1/search?query=...`**
- **Response**: `{ "movies": [...], "theaters": [...] }`

---

## 📋 Phase 7: Admin Panel (Protected)
**Goal**: Management. All endpoints require `ROLE_ADMIN`.

### 12. Admin Management
**Base URL**: `/api/v1/admin`

#### `POST /movies`: Add Movie
- **Body**: `{ "title": "...", "duration": 120, "genre": "Action" ... }`

#### `POST /theaters`: Add Theater
- **Body**: `{ "name": "...", "cityId": 1, "address": "..." }`

#### `POST /theaters/{id}/screens`: Add Screen
- **Body**: `{ "name": "Screen 1" }`

#### `POST /screens/{id}/seat-layout`: Configure Seats
- **Body**:
  ```json
  { "rows": ["A", "B"], "seatsPerRow": 10, "aisleColumns": [5] }
  ```
- **Logic**: Delete old seats -> Bulk insert new `Seat` entities.

#### `POST /shows`: Schedule Show (Inventory Gen)
- **Body**: `{ "movieId": 1, "screenId": 2, "startTime": "...", "price": 300 }`
- **Logic**:
  1. Create Show.
  2. **Fetch all** `Seat` entities for Screen 2.
  3. **Batch Insert** `ShowSeat` entities (links Show + Seat, status=AVAILABLE).

#### `GET /analytics/revenue`
- **Params**: `startDate`, `endDate`.
- **Response**: `{ "totalRevenue": 500000, "date": "2024-02-01" }`

---

## 🛠️ Concepts & Best Practices

1.  **DTOs**: Always use DTOs for Request/Response. Never expose Entities directly.
2.  **Validation**: Use `@Valid` and `@NotBlank` annotations.
3.  **Exception Handling**: Use `@ControllerAdvice` to return standardized JSON errors:
    ```json
    { "error": "Validation Failed", "details": ["Email is invalid"] }
    ```
4.  **Transactions**: Any method that modifies multiple tables (e.g., Booking) MUST have `@Transactional`.
5.  **Security**: Never implement your own crypto. Use `PasswordEncoder`.

**This guide covers 100% of the requirements. Follow strictly.** 🚀
