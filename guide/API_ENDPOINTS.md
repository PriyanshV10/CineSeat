# Comprehensive Backend API Endpoints (RESTful Best Practices)

> **📊 Implementation Status**: 13/57 endpoints implemented (23%). See [API_IMPLEMENTATION_PROGRESS.md](file:///home/priyansh/.gemini/antigravity/brain/96f28b4c-c1d6-4d4e-be1d-28e03cb6e602/API_IMPLEMENTATION_PROGRESS.md) for detailed tracking.

This list follows standard REST conventions:

- **Versioning**: All API routes are prefixed with `/api/v1`.
- **Resources**: Nouns are used for resources (e.g., `movies`, `cities`).
- **HTTP Methods**: `GET` (read), `POST` (create), `PUT` (replace), `PATCH` (update), `DELETE` (remove).
- **Pagination**: List endpoints support `page` and `size` query parameters.
- **Role-Based Access**: `USER` (customers), `THEATER` (theater owners), `ADMIN` (system admin)
- **Legend**: ✅ = Implemented | 🔨 = To Build | 🔐 = Requires Authentication

---

## 1. Authentication & Identity

**Base URL:** `/api/v1/auth`

- ✅ `POST /register` - Register a new user (supports USER and THEATER roles)
  - _Body:_ `email`, `password`, `name`, `role` (USER or THEATER)
- ✅ `POST /login` - Login and retrieve JWT token
  - _Body:_ `email`, `password`
  - _Response:_ JWT token, user details
- 🔨 `POST /refresh-token` - Refresh access token
- 🔨 `POST /logout` - Invalidate refresh token (blacklist)
- 🔨 `POST /password/forgot` - Request password reset email
- 🔨 `POST /password/reset` - Complete password reset with token
- 🔨 `POST /verify-email` - Verify email with token

---

## 2. User Profile

**Base URL:** `/api/v1/users/me` 🔐

- ✅ `GET /` - Get current user profile
- ✅ `PATCH /` - Update profile fields (name, phone, preferences)
  - _Body:_ `name`, `phoneNumber`
- ✅ `POST /avatar` - Upload/update profile picture (multipart)
  - _Body:_ `file` (multipart/form-data)
- 🔨 `GET /bookings` - Get booking history (paginated)
  - _Params:_ `page`, `size`, `status` (CONFIRMED, CANCELLED, EXPIRED)
- 🔨 `GET /reviews` - Get reviews posted by the user
- 🔨 `GET /wishlist` - Get saved/wishlisted movies
- 🔨 `POST /wishlist` - Add movie to wishlist
  - _Body:_ `movieId`
- 🔨 `DELETE /wishlist/{movieId}` - Remove movie from wishlist

---

## 3. Location (Cities)

**Base URL:** `/api/v1/cities`

- ✅ `GET /` - List all active cities
  - _Params:_ `name` (optional, search by name)
- ✅ `GET /{id}` - Get city details by ID

---

## 4. Movies (Public)

**Base URL:** `/api/v1/movies`

- ✅ `GET /` - List movies with filters and pagination
  - _Params:_ `cityId`, `language`, `genre`, `status` (NOW_SHOWING, UPCOMING, COMING_SOON), `page`, `size`
- 🔨 `GET /trending` - Get trending/popular movies
  - _Params:_ `cityId`, `limit`
- ✅ `GET /{id}` - Get detailed movie information
- 🔨 `GET /{id}/cast` - Get cast and crew details
- 🔨 `GET /{id}/languages` - Get available languages/formats for the movie
- 🔨 `GET /{id}/shows` - Get all shows for this movie
  - _Params:_ `cityId`, `date`, `theaterId`
- 🔨 `GET /{id}/reviews` - Get reviews for a movie (paginated)
  - _Params:_ `page`, `size`, `sort` (RECENT, HIGHEST_RATED)
- 🔨 `POST /{id}/reviews` - Post a review 🔐
  - _Body:_ `rating` (1-5), `comment`
- 🔨 `PUT /{id}/reviews/{reviewId}` - Update own review 🔐
- 🔨 `DELETE /{id}/reviews/{reviewId}` - Delete own review 🔐

---

## 5. Theaters (Public)

**Base URL:** `/api/v1/theaters`

- ✅ `GET /` - List theaters
  - _Params:_ `cityId` (optional), `movieId` (optional), `date` (optional)
- 🔨 `GET /{id}` - Get theater details (name, address, amenities, location, screens)
- 🔨 `GET /{id}/shows` - Get all shows for a specific theater
  - _Params:_ `date` (required), `movieId` (optional)
- 🔨 `GET /{id}/screens` - Get all screens in a theater with basic info

---

## 6. Shows (Discovery & Seat Selection)

**Base URL:** `/api/v1/shows`

- 🔨 `GET /` - Search/List shows
  - _Params:_ `cityId` (required), `movieId`, `date`, `theaterId`, `nearLocation` (lat,lng)
  - _Response:_ Paginated list of shows with movie, theater, screen, time, price
- 🔨 `GET /{id}` - Get show metadata (movie, theater, screen, time, pricing)
- 🔨 `GET /{id}/seats` - **(Real-time)** Get seat layout with availability status
  - _Response:_ Seat grid with `AVAILABLE`, `BOOKED`, `LOCKED`, `BLOCKED` statuses
  - _Note:_ Should update every 30 seconds or use WebSocket for real-time updates

---

## 7. Booking Workflow & Payments

**Base URL:** `/api/v1/bookings` 🔐

- 🔨 `POST /` - **Create Booking** (locks seats temporarily)
  - _Body:_ `showId`, `seatIds[]`
  - _Response:_ `bookingId`, `amount`, `expiresAt` (typically 10 minutes)
- 🔨 `GET /{id}` - Get booking details
  - _Response:_ Show details, seats, price, status, expiration
- 🔨 `POST /{id}/payment-intent` - Initiate payment flow
  - _Response:_ Payment gateway `orderId`, `amount`, `currency`
- 🔨 `PATCH /{id}/confirm` - **Confirm Booking** after successful payment
  - _Body:_ `paymentId`, `signature` (for payment verification)
  - _Response:_ Confirmed booking with ticket details
- 🔨 `PATCH /{id}/cancel` - Cancel booking (if within cancellation window)
  - _Note:_ May incur cancellation charges based on policy
- 🔨 `POST /{id}/refund` - Request refund (if eligible)
- 🔨 `GET /{id}/ticket` - Get ticket details for download
  - _Response:_ QR code, PDF URL, show details, seats
- 🔨 `POST /apply-coupon` - Validate and apply discount coupon
  - _Body:_ `couponCode`, `bookingId`
  - _Response:_ Discount amount, final price

**Base URL:** `/api/v1/payments`

- 🔨 `POST /webhook` - **(Critical)** Handle payment gateway webhooks (Razorpay/Stripe)
  - _Note:_ Should verify webhook signature and update booking status

---

## 8. Offers & Coupons

**Base URL:** `/api/v1/offers`

- 🔨 `GET /` - List available offers and promotions
  - _Params:_ `cityId`, `active` (boolean), `page`, `size`
- 🔨 `GET /{id}` - Get offer details (terms, validity, discount)
- 🔨 `POST /validate` - Validate a coupon code
  - _Body:_ `couponCode`, `amount`, `showId` (optional)
  - _Response:_ Validity, discount amount/percentage, applicable conditions

---

## 9. Notifications

**Base URL:** `/api/v1/notifications` 🔐

- 🔨 `GET /` - Get user notifications (booking updates, offers, reminders)
  - _Params:_ `unreadOnly` (boolean), `page`, `size`
- 🔨 `PATCH /{id}/read` - Mark notification as read
- 🔨 `PATCH /read-all` - Mark all notifications as read
- 🔨 `DELETE /{id}` - Delete a notification

---

## 10. Global Search

**Base URL:** `/api/v1/search`

- 🔨 `GET /` - Unified search across Movies, Theaters, Events
  - _Params:_ `query` (required), `cityId`, `type` (MOVIE, THEATER, EVENT)
  - _Response:_ Grouped results by type with relevance scoring

---

## 11. Admin & Management

**Base URL:** `/api/v1/admin` 🔐  
**Access:** `ROLE_ADMIN` or `ROLE_THEATER`

### Movies

- ✅ `POST /movies` - Add new movie to catalog
  - _Body:_ `title`, `description`, `genre[]`, `language[]`, `duration`, `releaseDate`, `posterUrl`, `trailerUrl`, `rating`, `status`
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER`
- 🔨 `PUT /movies/{id}` - Update movie details
  - _Access:_ `ROLE_ADMIN`
- 🔨 `DELETE /movies/{id}` - Remove movie from catalog (soft delete)
  - _Access:_ `ROLE_ADMIN`

### Theaters & Screens

- ✅ `POST /theaters` - Register new theater
  - _Body:_ `name`, `address`, `cityId`, `location` (lat, lng), `amenities[]`, `contactInfo`
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER`
- 🔨 `PUT /theaters/{id}` - Update theater information
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theaters only)
- 🔨 `GET /theaters/my` - Get theaters owned by current user
  - _Access:_ `ROLE_THEATER`
- 🔨 `POST /theaters/{id}/screens` - Add screen to theater
  - _Body:_ `name`, `seatLayout` (rows, columns, seat types, pricing tiers)
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theater only)
- 🔨 `PUT /screens/{id}` - Update screen details and seat layout
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theater only)
- 🔨 `DELETE /screens/{id}` - Delete screen
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theater only)

### Shows

- 🔨 `POST /shows` - Schedule a new show
  - _Body:_ `movieId`, `screenId`, `startTime`, `price`, `language`, `format` (2D, 3D, IMAX)
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theater only)
- 🔨 `PUT /shows/{id}` - Update show details (time, price)
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theater only)
- 🔨 `DELETE /shows/{id}` - Cancel a show (if no confirmed bookings)
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theater only)
- 🔨 `GET /shows/my` - Get shows for theaters owned by current user
  - _Params:_ `date`, `movieId`, `theaterId`
  - _Access:_ `ROLE_THEATER`

### Offers

- 🔨 `POST /offers` - Create promotional offer or coupon
  - _Body:_ `code`, `description`, `discountType` (PERCENTAGE, FIXED), `discountValue`, `validFrom`, `validTo`, `minAmount`, `maxDiscount`, `usageLimit`
  - _Access:_ `ROLE_ADMIN`
- 🔨 `PUT /offers/{id}` - Update offer details
  - _Access:_ `ROLE_ADMIN`
- 🔨 `DELETE /offers/{id}` - Deactivate offer
  - _Access:_ `ROLE_ADMIN`

### Analytics

- 🔨 `GET /analytics/revenue` - Revenue reports and insights
  - _Params:_ `startDate`, `endDate`, `theaterId`, `movieId`, `groupBy` (DAY, WEEK, MONTH)
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theaters only)
- 🔨 `GET /analytics/occupancy` - Theater/show occupancy statistics
  - _Params:_ `startDate`, `endDate`, `theaterId`, `showId`
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theaters only)
- 🔨 `GET /analytics/bookings` - Booking trends and metrics
  - _Params:_ `startDate`, `endDate`, `theaterId`, `movieId`
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER` (own theaters only)
- 🔨 `GET /analytics/popular-movies` - Most booked movies
  - _Params:_ `cityId`, `startDate`, `endDate`, `limit`
  - _Access:_ `ROLE_ADMIN` or `ROLE_THEATER`
