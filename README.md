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
