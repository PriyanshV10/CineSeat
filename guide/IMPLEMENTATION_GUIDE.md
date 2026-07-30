# 🎓 The Ultimate Beginner's Guide (Priority & Detailed Logic)

This guide organizes **Detailed Logic** by **Difficulty Level**.
**Coverage:** 100% of the 64 endpoints from `API_ENDPOINTS.md`.

---

## 🟢 Level 1: The Foundation (Easy & Critical)
**Goal**: Get the app "running" with users and static data.

### 1. Identify (Auth)
**Priority**: 🚨 Critical | **Files**: `AuthController`, `AuthService`, `User`

*   `POST /auth/register`: Create User. Check email -> Hash password -> Save.
*   `POST /auth/login`: Validate credentials -> Return `{accessToken, refreshToken}`.
*   `POST /auth/refresh-token`: Verify refresh token -> Issue new access token.
*   `POST /auth/logout`: Revoke tokens.
*   `POST /auth/password/forgot`: Send recovery email.
*   `POST /auth/password/reset`: Update password with token.
*   `POST /auth/verify-email`: Confirm email address.

### 2. Locations (Cities)
**Priority**: 🚨 Critical | **Files**: `CityController`, `City`

*   `GET /cities`: List all cities.
*   `GET /cities/{id}`: Get city details.
*   `POST /admin/cities`: Add a city (Admin).

### 3. The Catalog (Movies & Theaters)
**Priority**: 🚨 Critical | **Files**: `MovieController`, `TheaterController`

*   **Movies**:
    *   `GET /movies`: Filter by City, Genre, Language.
    *   `GET /movies/trending`: Top 10 movies.
    *   `GET /movies/{id}`: Full details.
    *   `GET /movies/{id}/cast`: Actor list.
    *   `GET /movies/{id}/languages`: Available formats.
    *   **Admin**:
        *   `POST /admin/movies`: Create movie.
        *   `PUT /admin/movies/{id}`: Edit movie.
        *   `DELETE /admin/movies/{id}`: Remove movie.

*   **Theaters**:
    *   `GET /theaters`: Filter by City.
    *   `GET /theaters/{id}`: Address & Amenities.
    *   `GET /theaters/{id}/shows`: Schedule for today.
    *   **Admin**:
        *   `POST /admin/theaters`: Create theater.
        *   `PUT /admin/theaters/{id}`: Edit theater.

---

## 🟠 Level 2: The Core Logic (Hard & Important)
**Goal**: Make the app "functional" (Booking tickets).

### 4. Administrative Setup (Screens & Seats)
**Priority**: High | **Files**: `AdminController`, `Screen`, `Seat`

*   `POST /admin/theaters/{id}/screens`: Add "Screen 1".
*   `POST /admin/screens/{id}/seat-layout`: Create physical `Seat` rows A-Z.

### 5. Scheduling Shows (The Inventory)
**Priority**: 🚨 Critical | **Files**: `ShowController`, `Show`, `ShowSeat`

*   **Admin**:
    *   `POST /admin/shows`: **Inventory Gen**. Loop seats -> Create `ShowSeat`.
    *   `PUT /admin/shows/{id}`: Update time/price.
    *   `DELETE /admin/shows/{id}`: Cancel show (if no bookings).

### 6. Discovery (Finding Shows)
**Priority**: High | **Files**: `ShowController`

*   `GET /shows`: Filter by Movie + Date + City.
*   `GET /shows/{id}`: Show details.
*   `GET /shows/{id}/seats`: **The Seat Map**. Return Green/Red grid.

### 7. The Booking Engine (Transactions)
**Priority**: 🚨 Critical | **Files**: `BookingController`, `BookingService`

*   `POST /bookings`: **Atomic Locking**. Check Available -> Lock -> Create Booking.
*   `GET /bookings/{id}`: View status.
*   `POST /bookings/{id}/payment-intent`: Talk to Razorpay.
*   `PATCH /bookings/{id}/confirm`: Payment success -> Confirm Ticket.
*   `PATCH /bookings/{id}/cancel`: Release seats (if allowed).
*   `POST /bookings/{id}/refund`: Process refund.
*   `GET /bookings/{id}/ticket`: Generate QR Code.
*   `POST /bookings/apply-coupon`: Apply discount.

*   **System**:
    *   `POST /payments/webhook`: Handle async Razorpay updates.

---

## 🔵 Level 3: The Polish (Nice to Have)
**Goal**: Better User Experience.

### 8. User Features
**Priority**: Medium | **Files**: `UserController`

*   `GET /me`: Profile.
*   `PATCH /me`: Edit Name/Phone.
*   `POST /me/avatar`: Upload photo.
*   `GET /me/bookings`: History.
*   `GET /me/reviews`: My Reviews.
*   `GET /me/wishlist`: Get Wishlist.
*   `POST /me/wishlist`: Add to Wishlist.
*   `DELETE /me/wishlist/{movieId}`: Remove from Wishlist.

### 9. Engagement (Reviews & Offers)
**Priority**: Low | **Files**: `ReviewController`, `OfferController`

*   **Reviews**:
    *   `GET /movies/{id}/reviews`: Read reviews.
    *   `POST /movies/{id}/reviews`: Write review.
    *   `PUT .../reviews/{id}`: Edit review.
    *   `DELETE .../reviews/{id}`: Delete review.

*   **Offers**:
    *   `GET /offers`: List active coupons.
    *   `GET /offers/{id}`: Details.
    *   `POST /offers/validate`: Check code.
    *   **Admin**:
        *   `POST /admin/offers`: Create coupon.
        *   `PUT /admin/offers/{id}`: Update.
        *   `DELETE /admin/offers/{id}`: Stop.

### 10. Advanced Features
**Priority**: Low

*   `GET /search`: Global search (Movies + Theaters).
*   `GET /notifications`: Alerts.
*   `PATCH /notifications/{id}/read`: Mark read.
*   `PATCH /notifications/read-all`: Mark all read.
*   **Admin Analytics**:
    *   `GET /admin/analytics/revenue`
    *   `GET /admin/analytics/occupancy`
    *   `GET /admin/analytics/bookings`

---

**100% Covered. Start at Level 1, Item 1.** 🚀
