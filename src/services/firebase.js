import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8Z8QZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8",
  authDomain: "juniorkits-12345.firebaseapp.com",
  projectId: "juniorkits-12345",
  storageBucket: "juniorkits-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Authentication service
export const authService = {
  async login(passcode) {
    try {
      // For this application, we'll use a simple passcode authentication
      // In a real application, you'd want proper authentication
      if (passcode === 'joopie') {
        return { success: true, user: { uid: 'admin' } };
      } else {
        throw new Error('Invalid passcode');
      }
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};

// Equipment service
export const equipmentService = {
  collection: collection(db, 'equipment'),

  async getAll() {
    const snapshot = await getDocs(query(this.collection, orderBy('shortName')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async create(equipment) {
    const docRef = doc(this.collection);
    await setDoc(docRef, {
      ...equipment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  },

  async update(id, updates) {
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  async delete(id) {
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
  }
};

// Job service
export const jobService = {
  collection: collection(db, 'jobs'),

  async getAll() {
    const snapshot = await getDocs(query(this.collection, orderBy('date', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async create(job) {
    const docRef = doc(this.collection);
    await setDoc(docRef, {
      ...job,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  },

  async update(id, updates) {
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  async delete(id) {
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
  }
};

export { db, auth };