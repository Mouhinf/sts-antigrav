import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryConstraint
} from "firebase/firestore";
import { db } from "./client";
import { 
  Property, 
  Vehicle, 
  Booking, 
  Quote, 
  Message, 
  Training, 
  BlogPost 
} from "@/types";

// Helper generic CRUD
const createCRUD = <T extends { id?: string }>(collectionName: string) => {
  const colRef = collection(db, collectionName);

  return {
    getAll: async (constraints: QueryConstraint[] = []) => {
      const q = query(colRef, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },
    getOne: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
    },
    create: async (data: Omit<T, "id" | "createdAt" | "updatedAt">) => {
      return await addDoc(colRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as any);
    },
    update: async (id: string, data: Partial<T>) => {
      const docRef = doc(db, collectionName, id);
      return await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      } as any);
    },
    delete: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      return await deleteDoc(docRef);
    }
  };
};

export const properties = createCRUD<Property>("properties");
export const vehicles = createCRUD<Vehicle>("vehicles");
export const bookings = createCRUD<Booking>("bookings");
export const quotes = createCRUD<Quote>("quotes");
export const messages = createCRUD<Message>("messages");
export const trainings = createCRUD<Training>("trainings");
export const blogPosts = createCRUD<BlogPost>("blog_posts");
export const newsletter = {
  ...createCRUD<{ id: string; email: string; active: boolean; subscribedAt: Timestamp }>("newsletter"),
  subscribe: async (email: string) => {
    const colRef = collection(db, "newsletter");
    return await addDoc(colRef, {
      email,
      active: true,
      subscribedAt: serverTimestamp(),
    });
  }
};
