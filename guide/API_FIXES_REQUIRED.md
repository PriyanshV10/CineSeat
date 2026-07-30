# API Issues & Required Fixes

This document identifies problems in your current implementation and provides step-by-step fixes.

---

## 🚨 **Critical Issues Found**

### **Issue #1: Missing API Versioning**
**Current:**
- `/auth/register`
- `/api/movies`
- `/api/cities`
- `/api/theaters`

**Problem:** Inconsistent! Auth has no `/api` prefix, others do. None have versioning.

**Fix:**
All endpoints should use `/api/v1` prefix for future-proofing.

---

### **Issue #2: Theater Creation is Public (Security Risk!)**
**Current:** `POST /api/theaters` - Anyone can create theaters!

**Problem:** This should be admin/owner-only. Regular users shouldn't create theaters.

**Fix:** Move to `/api/v1/admin/theaters` and add `@PreAuthorize("hasRole('ADMIN')")`

---

### **Issue #3: Movie Creation is Public**
**Current:** `POST /api/movies` - Anyone can add movies!

**Problem:** Same as theaters - this is admin functionality.

**Fix:** Move to `/api/v1/admin/movies`

---

### **Issue #4: Inconsistent Path Structure**
**Current:**
- `GET /api/city/{cityId}/theaters` (nested resource)
- `GET /api/theaters` (flat resource)

**Problem:** Mixing styles. REST best practice: Use query params for filtering, not nested paths (unless true parent-child relationship).

**Better:** `GET /api/v1/theaters?cityId={cityId}`

---

### **Issue #5: Missing Leading Slash**
**Current:** `@RequestMapping("api/movies")` (line 8 in MovieController)

**Problem:** Should be `"/api/movies"` with leading slash.

**Fix:** Add `/` to all `@RequestMapping` annotations.

---

## ✅ **Required Changes by Controller**

### **1. AuthController** (`/auth` → `/api/v1/auth`)

**Change:**
```java
@RequestMapping("/api/v1/auth")  // Add /api/v1 prefix
```

**Endpoints after fix:**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

---

### **2. CityController** (`/api/cities` → `/api/v1/cities`)

**Change:**
```java
@RequestMapping("/api/v1/cities")  // Add leading slash + version
```

**Endpoints after fix:**
- `GET /api/v1/cities`
- `GET /api/v1/cities/{id}`

---

### **3. MovieController** (Split into Public + Admin)

**Current Issues:**
- Missing leading slash
- `POST /api/movies` should be admin-only

**Changes:**

**Create TWO controllers:**

**a) MovieController (Public)**
```java
@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {
  
  @GetMapping  // GET /api/v1/movies
  public List<Movie> getMovies() { ... }
  
  @GetMapping("/{id}")  // GET /api/v1/movies/{id}
  public Movie getMovie(@PathVariable long id) { ... }
}
```

**b) AdminMovieController (Admin)**
```java
@RestController
@RequestMapping("/api/v1/admin/movies")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMovieController {
  
  @PostMapping  // POST /api/v1/admin/movies
  public Movie addMovie(@RequestBody Movie movie) { ... }
  
  @PutMapping("/{id}")  // PUT /api/v1/admin/movies/{id}
  public Movie updateMovie(@PathVariable long id, @RequestBody Movie movie) { ... }
  
  @DeleteMapping("/{id}")  // DELETE /api/v1/admin/movies/{id}
  public void deleteMovie(@PathVariable long id) { ... }
}
```

---

### **4. TheaterController** (Split into Public + Admin)

**Current Issues:**
- Inconsistent base path (`api` vs `api/theaters`)
- `POST /api/theaters` should be admin-only
- Nested path `/api/city/{cityId}/theaters` should use query param

**Changes:**

**a) TheaterController (Public)**
```java
@RestController
@RequestMapping("/api/v1/theaters")
public class TheaterController {
  
  @GetMapping  // GET /api/v1/theaters?cityId={cityId}
  public List<Theater> getTheaters(@RequestParam(required = false) Long cityId) {
    if (cityId != null) {
      return theaterService.getTheatersByCityId(cityId);
    }
    return theaterService.getAllTheaters();
  }
  
  @GetMapping("/{id}")  // GET /api/v1/theaters/{id}
  public Theater getTheater(@PathVariable Long id) { ... }
}
```

**b) AdminTheaterController (Admin)**
```java
@RestController
@RequestMapping("/api/v1/admin/theaters")
@PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
public class AdminTheaterController {
  
  @PostMapping  // POST /api/v1/admin/theaters
  public ResponseEntity<Theater> addTheater(@Valid @RequestBody CreateTheaterRequest request) { ... }
  
  @PutMapping("/{id}")  // PUT /api/v1/admin/theaters/{id}
  public Theater updateTheater(@PathVariable Long id, @RequestBody UpdateTheaterRequest request) { ... }
}
```

---

## 📋 **Migration Checklist**

### **Step 1: Enable Method Security**
Add to your main application class:
```java
@EnableMethodSecurity  // Add this annotation
@SpringBootApplication
public class CineSeatApplication {
  public static void main(String[] args) {
    SpringApplication.run(CineSeatApplication.class, args);
  }
}
```

### **Step 2: Fix AuthController**
- [ ] Change `@RequestMapping("/auth")` → `@RequestMapping("/api/v1/auth")`

### **Step 3: Fix CityController**
- [ ] Change `@RequestMapping("api/cities")` → `@RequestMapping("/api/v1/cities")`

### **Step 4: Split MovieController**
- [ ] Create `AdminMovieController` with `@PreAuthorize("hasRole('ADMIN')")`
- [ ] Move `POST /movies` to admin controller
- [ ] Update `MovieController` path to `/api/v1/movies`

### **Step 5: Split TheaterController**
- [ ] Create `AdminTheaterController`
- [ ] Move `POST /theaters` to admin controller
- [ ] Change `GET /api/city/{cityId}/theaters` → `GET /api/v1/theaters?cityId={cityId}`
- [ ] Update base path to `/api/v1/theaters`

### **Step 6: Update Frontend**
- [ ] Change all API calls to use `/api/v1` prefix
- [ ] Update axios base URL to `http://localhost:8080/api/v1`

### **Step 7: Test Everything**
- [ ] Test auth endpoints with Postman
- [ ] Test public endpoints (movies, cities, theaters)
- [ ] Test admin endpoints (should return 403 for non-admin users)

---

## 🎯 **Summary of Changes**

| Current Endpoint | Issue | New Endpoint | Access |
|-----------------|-------|--------------|--------|
| `POST /auth/register` | No versioning | `POST /api/v1/auth/register` | Public |
| `POST /auth/login` | No versioning | `POST /api/v1/auth/login` | Public |
| `GET /api/cities` | No version | `GET /api/v1/cities` | Public |
| `GET /api/movies` | No version | `GET /api/v1/movies` | Public |
| `POST /api/movies` | Public access | `POST /api/v1/admin/movies` | Admin |
| `GET /api/theaters` | No version | `GET /api/v1/theaters` | Public |
| `POST /api/theaters` | Public access | `POST /api/v1/admin/theaters` | Admin |
| `GET /api/city/{cityId}/theaters` | Nested path | `GET /api/v1/theaters?cityId={id}` | Public |

---

## 💡 **Why These Changes Matter**

1. **Versioning (`/api/v1`)**: When you make breaking changes later, you can create `/api/v2` without breaking existing clients.

2. **Admin Separation**: Prevents security vulnerabilities. Imagine if anyone could create fake theaters or movies!

3. **Consistent Paths**: Makes your API predictable and easier to document.

4. **Query Params vs Nested Paths**: 
   - Use nested: `/theaters/{theaterId}/screens` (screens belong to theater)
   - Use query param: `/theaters?cityId=1` (filtering, not ownership)

---

## 🚀 **Next Steps**

1. Start with **Step 1** (Enable Method Security)
2. Fix controllers **one by one** (don't do all at once)
3. Test each controller after fixing
4. Update your Postman collection
5. Update frontend API calls

Would you like me to help you implement these fixes?
