# 🎬 CineSeat API — Beginner's Fresh Start Roadmap

> **Starting point:** 0 endpoints implemented. We are starting completely fresh!

Welcome to the CineSeat backend project! Building 57 endpoints might seem overwhelming, but we will break it down into small, logical phases. You'll learn new concepts only when you need them.

---

## 🛠️ The Core Pattern (Learn This First!)

For every single feature you build, you will follow this exact flow:

1. **Entity (`.java`)**: The database table definition (e.g., `User`, `Movie`).
2. **Repository (`.java`)**: The interface that talks to the database (saves, finds, deletes).
3. **DTOs (`.java`)**: Data Transfer Objects. The shape of the data coming in (Requests) and going out (Responses).
4. **Service (`.java`)**: The business logic. This is where the magic happens (e.g., checking if a seat is available).
5. **Controller (`.java`)**: The API endpoint itself. It receives the HTTP request and calls the Service.

---

## 🗺️ The Roadmap

### Phase 1 — Foundation & Authentication (The Gateway)
**Goal:** Let users sign up and log in securely.

**Endpoints (8):**
- `POST /api/v1/auth/register` (Create User/Theater owner)
- `POST /api/v1/auth/login` (Get JWT token)
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/password/forgot`
- `POST /api/v1/auth/password/reset`
- `POST /api/v1/auth/verify-email`
- `GET /api/v1/users/me` (Get my profile)

**🧠 What you need to learn:**
*   **Spring Boot Basics:** How to create a project, configure a database (application.properties).
*   **Spring Data JPA:** How to map Java classes to database tables (`@Entity`, `@Table`).
*   **Spring Security & JWT:** How to protect endpoints and issue tokens. This is often the hardest part for beginners. Take your time here!
*   **BCrypt:** Hashing passwords before saving them. NEVER save plain-text passwords.
*   **Sending Emails:** (`spring-boot-starter-mail`) for password resets.

---

### Phase 2 — Catalog Management (Admin Stuff)
**Goal:** Allow admins to add cities, movies, and theaters.

**Endpoints (10):**
- `GET /api/v1/cities` & `GET /api/v1/cities/{id}`
- `POST /api/v1/admin/movies` & `PUT /api/v1/admin/movies/{id}` & `DELETE /api/v1/admin/movies/{id}`
- `POST /api/v1/admin/theaters` & `PUT /api/v1/admin/theaters/{id}`
- `POST /api/v1/admin/theaters/{id}/screens` & `PUT /api/v1/admin/screens/{id}` & `DELETE /api/v1/admin/screens/{id}`

**🧠 What you need to learn:**
*   **Role-Based Access Control (RBAC):** Using `@PreAuthorize("hasRole('ADMIN')")` so only admins can add movies.
*   **Validation:** Using `@Valid` and `@NotBlank` to ensure admins don't submit empty movie titles.
*   **One-to-Many Relationships:** A `Theater` has many `Screens` (`@OneToMany`).

---

### Phase 3 — Public Browsing (What the User Sees)
**Goal:** Let anyone (even logged out) browse movies and theaters.

**Endpoints (10):**
- `GET /api/v1/movies` (List with filters like city, genre)
- `GET /api/v1/movies/trending`
- `GET /api/v1/movies/{id}`
- `GET /api/v1/movies/{id}/cast`
- `GET /api/v1/movies/{id}/languages`
- `GET /api/v1/theaters`
- `GET /api/v1/theaters/{id}`
- `GET /api/v1/theaters/my` (For theater owners)
- `GET /api/v1/theaters/{id}/shows`
- `GET /api/v1/theaters/{id}/screens`

**🧠 What you need to learn:**
*   **Pagination & Sorting:** Using Spring's `Pageable` so you don't send 10,000 movies at once.
*   **Filtering (JPA Specifications):** How to search for "Action movies in New York".

---

### Phase 4 — Scheduling Shows (Connecting Movies to Theaters)
**Goal:** Allow theater owners to schedule a movie on a specific screen at a specific time.

**Endpoints (6):**
- `POST /api/v1/admin/shows`
- `PUT /api/v1/admin/shows/{id}`
- `DELETE /api/v1/admin/shows/{id}`
- `GET /api/v1/admin/shows/my`
- `GET /api/v1/shows` (Public search for shows)
- `GET /api/v1/shows/{id}`

**🧠 What you need to learn:**
*   **Date/Time Handling:** Using `LocalDateTime` properly.
*   **Complex Relationships:** A `Show` connects a `Movie`, a `Screen`, and has a start time and price.
*   **The Big Logic Jump:** When a `Show` is created, you must automatically generate rows in a `ShowSeat` table for every physical seat in that screen. This is crucial for booking later.

---

### Phase 5 — The Core Engine: Seating & Booking (The Hard Part!)
**Goal:** Let users lock seats and confirm bookings.

**Endpoints (7):**
- `GET /api/v1/shows/{id}/seats` (See available/booked seats)
- `POST /api/v1/bookings` (Lock seats for 10 mins)
- `GET /api/v1/bookings/{id}`
- `PATCH /api/v1/bookings/{id}/cancel`
- `POST /api/v1/bookings/{id}/refund`
- `GET /api/v1/bookings/{id}/ticket`
- `GET /api/v1/users/me/bookings` (User history)

**🧠 What you need to learn:**
*   **Concurrency & Transactions (`@Transactional`):** What happens if two people click the same seat at the exact same millisecond? You must learn how to handle database locking to prevent double bookings.
*   **Scheduled Tasks (`@Scheduled`):** If a user locks a seat but doesn't pay, you need a background job that runs every minute to release expired seats back to `AVAILABLE`.
*   **PDF/QR Code Generation:** Creating the actual ticket file (using libraries like iText or ZXing).

---

### Phase 6 — Payments & Coupons
**Goal:** Collect real money.

**Endpoints (5):**
- `POST /api/v1/bookings/{id}/payment-intent`
- `PATCH /api/v1/bookings/{id}/confirm`
- `POST /api/v1/payments/webhook`
- `POST /api/v1/bookings/apply-coupon`
- `POST /api/v1/offers/validate`

**🧠 What you need to learn:**
*   **Payment Gateway Integration:** Integrating Stripe or Razorpay SDKs.
*   **Webhooks:** Your server needs to listen for Stripe/Razorpay telling you "Payment Successful" asynchronously.
*   **Security:** Verifying webhook signatures so hackers can't fake successful payments.

---

### Phase 7 — Polish & Advanced Features
**Goal:** Add the nice-to-have features that make the app feel complete.

**Endpoints (11):**
- **Reviews:** Post/Edit/Delete movie reviews.
- **Wishlist:** Add/remove movies to a saved list.
- **Search:** Global search bar functionality.
- **Notifications:** In-app alerts.
- **Analytics:** Dashboards for admins (revenue, popular movies).

**🧠 What you need to learn:**
*   **Aggregation Queries:** Writing SQL/JPQL to calculate "Total Revenue this month" or "Most popular movie".
*   **Many-to-Many Relationships:** For user wishlists.

---

## 💡 Top Advice for a Complete Beginner

1.  **Don't build the UI yet.** Use Postman or Swagger to test every single endpoint as you build it.
2.  **Master Phase 1 before moving on.** If your authentication is broken, the whole app breaks.
3.  **One Endpoint at a Time.** Don't try to write 5 endpoints in a day. Write one. Test it. Understand it. Move to the next.
4.  **Google Errors.** You will get 100s of stack traces. Copy the first line of the error and paste it into Google. Every developer does this.
