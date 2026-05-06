# Authly — Authentication UI Boilerplate

A complete, drop-in authentication UI kit. All the pages you need to ship a secure login flow — login, register, password recovery, email verification, two-factor authentication, and a protected account area.

## What's Included

### `variant-1-split-screen/`
- `login.html` — Sign in with email + password, social auth (Google, GitHub)
- `register.html` — Sign up with password strength meter
- `forgot-password.html` — Request a reset link
- `reset-password.html` — Set new password with strength meter and match validation
- `verify-email.html` — 6-digit code input with auto-advance, paste support, resend timer
- `two-factor.html` — TOTP code entry for 2FA

### `protected/`
- `dashboard.html` — Sample protected page with sign-out
- `account.html` — Account settings (profile, password, 2FA, sessions, delete)

### Shared
- `auth.js` — Validation helpers, password strength calculator, mock JWT logic, route protection example
- `auth.css` — Shared styles

## Tech Stack

- HTML + Tailwind CSS (CDN)
- Vanilla JavaScript
- No build step

## Quick Start

Open any `.html` file in your browser. The flow is wired up so you can navigate end-to-end:

login → forgot password → reset → dashboard
register → verify email → dashboard
login → two-factor → dashboard

## Connecting a Real Backend

The forms post to JS handlers that simulate API calls. Replace the `setTimeout` blocks with real API calls.

**Supabase example:**
```js
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});
if (data) window.location.href = '/dashboard';
```

**Firebase example:**
```js
import { signInWithEmailAndPassword } from 'firebase/auth';
await signInWithEmailAndPassword(auth, email, password);
```

**Custom JWT backend:**
```js
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await res.json();
localStorage.setItem('token', token);
```

## Customization

- **Colors** — search `indigo-600` and replace with your brand color
- **Logo** — replace the SVG inside the brand panel
- **Copy** — the brand panels on the left contain marketing copy you can change

## License

Single use. Use in unlimited personal & commercial projects. Cannot be resold as a template.
