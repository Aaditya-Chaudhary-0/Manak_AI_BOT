# AUTH_SPEC.md — ManakAI

Owner: Dev 2.

## 1. Flow

```
Signup: POST /api/auth/signup {name, email, password}
   → hash password (Argon2id or bcrypt, cost factor per library defaults — don't hand-roll)
   → insert into users (role defaults to 'user')
   → return user object (never return password_hash)

Login: POST /api/auth/login {email, password}
   → verify password against stored hash
   → issue JWT (see §2)
   → return {access_token, token_type: "bearer", user}

Authenticated request:
   → client sends Authorization: Bearer <token>
   → FastAPI dependency decodes + verifies JWT, loads user, attaches to request context
```

## 2. JWT Structure

```json
{
  "sub": "user_uuid",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234571490
}
```
- Signing: HS256 with `JWT_SECRET` from env (never hardcoded, never committed).
- Expiry: 60 minutes for MVP (no refresh-token flow needed at hackathon scope — user just logs in again).

## 3. FastAPI Dependency Pattern

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = await get_user_by_id(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
```

Use `Depends(get_current_user)` on any authenticated route, `Depends(require_admin)` on `/api/admin/*` routes.

## 4. Guest Access

`/api/search` and `/api/standards/*` should work **without** auth (guest search) — the PS explicitly targets
consumers who may not want to sign up just to ask a question. `/api/history` and `/api/feedback` require auth,
since they're tied to a user record. `queries.user_id` is nullable specifically to support guest queries (see
`DATABASE_SCHEMA.md`).

## 5. Password Requirements (MVP)

- Minimum 8 characters — don't over-engineer complexity rules for a hackathon prototype; this isn't the part
  that needs to impress judges.
- Never log raw passwords, even at debug level.

## 6. Security Checklist

- [ ] `JWT_SECRET` only in `.env`, never committed (confirm `.env` is in `.gitignore`).
- [ ] Rate limit `/api/auth/login` (e.g. 5 attempts / minute / IP) to blunt brute-force attempts.
- [ ] HTTPS assumed at deployment (Vercel handles frontend; backend host must terminate TLS too).
- [ ] Admin routes always go through `require_admin`, never role-checked ad hoc inside a handler.
