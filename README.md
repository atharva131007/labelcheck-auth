# LabelCheck Auth

Build a modern login and signup system for my web app called "LabelCheck".

Tech stack:

- React

- TypeScript

- Tailwind CSS

- FastAPI backend

- Use a simple database for users

Design:

- Clean, modern government-tech SaaS style

- Professional but visually attractive

- White/light background with dark blue/navy accents

- Responsive on desktop and mobile

- LabelCheck logo/name at the top

- Centered authentication card

- Rounded inputs and buttons

- Minimal animations

LOGIN PAGE:

- LabelCheck branding

- Heading: "Welcome back"

- Email or Mobile Number input

- Password input with show/hide password button

- "Remember me" checkbox

- "Login" button

- "Forgot Password?" text

- Divider with "OR"

- "Continue with Google" button (UI only for now; do not implement Google OAuth)

- "Don't have an account? Sign Up"

SIGNUP PAGE:

- Full Name

- Email or Mobile Number

- Password

- Confirm Password

- Account Type dropdown:

  - Consumer

  - Business

  - Government Authority

- Create Account button

FUNCTIONALITY:

- Connect login and signup forms to FastAPI endpoints.

- Store users in the database with hashed passwords.

- Validate required fields.

- Validate password confirmation.

- Show clear error messages for invalid credentials.

- Show success message after registration.

- After successful login, redirect to /dashboard.

- Store the user's account type and display the appropriate dashboard heading.

- Do not implement real OTP, Google OAuth, or government SSO yet.

- Keep the authentication architecture easy to extend later.

Create the required React components, pages, API calls, FastAPI routes, database models and authentication logic.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/029d2e43-21cd-40e9-bac9-333c68d3651b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
