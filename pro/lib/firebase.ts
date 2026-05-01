import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

export const firebaseConfigured = !!(cfg.apiKey && cfg.authDomain && cfg.projectId)

const app = firebaseConfigured
  ? (getApps().length ? getApps()[0] : initializeApp(cfg as Required<typeof cfg>))
  : null

export const firebaseAuth = app ? getAuth(app) : null
