# Studio Inventory

A single-auth React frontend for managing film & photo production gear and jobs. Data is stored in localStorage for demonstration.

Run locally:

1. npm install
2. npm run dev

Login passcode: `joopie`

Firebase (optional deployment)

1. Create a Firebase project and enable Firestore and Hosting.
2. Add the web app credentials in the Firebase console and copy the config values.
3. Create a `.env.local` from `.env.example` and fill in the `VITE_FIREBASE_*` values.
4. If you want to deploy, install the Firebase CLI and run `firebase init` (choose Hosting + Firestore), then `firebase deploy`.

Firestore rules (basic demo rule to require auth):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## CI & Deploy (GitHub Actions → Firebase Hosting)

A GitHub Actions workflow is included to build the app and deploy to Firebase Hosting when changes are pushed to `main`.

How to set up:

1. Create a Firebase project and enable Hosting.
2. Log in locally and generate a CI token:

   - Install the Firebase CLI: `npm install -g firebase-tools`
   - Run: `firebase login:ci` and copy the token it prints.

3. In your GitHub repository settings > Secrets, add the following secrets:

   - `FIREBASE_TOKEN` — the token from `firebase login:ci`
   - `FIREBASE_PROJECT` — your Firebase project id (e.g., `my-studio-inventory`)
   - `VITE_FIREBASE_API_KEY` — your Firebase Web API key (used at build time)
   - `VITE_FIREBASE_AUTH_DOMAIN` — your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID` — your Firebase project id
   - `VITE_FIREBASE_STORAGE_BUCKET` — your Firebase storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` — messaging sender id
   - `VITE_FIREBASE_APP_ID` — app id

These `VITE_*` secrets are written into `.env.production` during the workflow so Vite bakes the correct values into the build.

The workflow is at `.github/workflows/firebase-deploy.yml`. When the workflow runs it will create `.env.production`, build, and deploy to Firebase Hosting using `FIREBASE_TOKEN` and `FIREBASE_PROJECT`.

> For enhanced security, consider using a Service Account and `FirebaseExtended/action-hosting-deploy@v0` instead of a CI token.

