import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Use custom database ID if present in config, or default
const firestoreDatabaseId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
const db = firestoreDatabaseId && firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Auth Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await saveUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request'
    ) {
      console.info('Google Sign-in popup was closed by user.');
      return null;
    }
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// User Profile persistence
export const saveUserProfile = async (user: User) => {
  if (!user) return;
  const userRef = doc(db, 'user_profiles', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Creator',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else {
    await setDoc(
      userRef,
      {
        displayName: user.displayName || 'Creator',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }
};

// Save / Bookmark Works in Firestore
export const saveWorkItem = async (userId: string, workId: string) => {
  const q = query(
    collection(db, 'saved_works'),
    where('userId', '==', userId),
    where('workId', '==', workId)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    await addDoc(collection(db, 'saved_works'), {
      userId,
      workId,
      savedAt: new Date().toISOString(),
    });
  }
};

export const unsaveWorkItem = async (userId: string, workId: string) => {
  const q = query(
    collection(db, 'saved_works'),
    where('userId', '==', userId),
    where('workId', '==', workId)
  );
  const snap = await getDocs(q);
  snap.forEach(async (document) => {
    await deleteDoc(doc(db, 'saved_works', document.id));
  });
};

export const subscribeSavedWorks = (
  userId: string,
  callback: (savedWorkIds: string[]) => void
) => {
  const q = query(collection(db, 'saved_works'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const ids = snapshot.docs.map((doc) => doc.data().workId as string);
    callback(ids);
  });
};

// Like / Appreciation Works in Firestore
export const toggleLikeWork = async (userId: string, workId: string, currentLiked: boolean) => {
  const q = query(
    collection(db, 'work_likes'),
    where('userId', '==', userId),
    where('workId', '==', workId)
  );
  const snap = await getDocs(q);

  if (currentLiked) {
    snap.forEach(async (document) => {
      await deleteDoc(doc(db, 'work_likes', document.id));
    });
  } else if (snap.empty) {
    await addDoc(collection(db, 'work_likes'), {
      userId,
      workId,
      likedAt: new Date().toISOString(),
    });
  }
};

export const subscribeUserLikes = (
  userId: string,
  callback: (likedIds: string[]) => void
) => {
  const q = query(collection(db, 'work_likes'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const ids = snapshot.docs.map((doc) => doc.data().workId as string);
    callback(ids);
  });
};

// Newsletter Subscription in Firestore
export const addNewsletterSubscription = async (email: string, userId?: string) => {
  await addDoc(collection(db, 'subscriptions'), {
    email,
    userId: userId || null,
    createdAt: new Date().toISOString(),
  });
};

// Contact Inquiry in Firestore
export interface InquiryData {
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
  userId?: string;
}

export const addInquiry = async (data: InquiryData) => {
  await addDoc(collection(db, 'inquiries'), {
    ...data,
    userId: data.userId || null,
    createdAt: new Date().toISOString(),
  });
};

export { app, auth, db, onAuthStateChanged };
export type { User };
