import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Property, Vehicle, Training, BlogPost } from "@/types";

// ==================== CRUD GENERIC ====================

interface CreateOptions {
  addTimestamps?: boolean;
}

interface UpdateOptions {
  updateTimestamp?: boolean;
}

export async function createDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T,
  options: CreateOptions = { addTimestamps: true }
): Promise<string> {
  const docData = options.addTimestamps
    ? { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    : data;

  const docRef = await addDoc(collection(db, collectionName), docData as any);
  return docRef.id;
}

export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
  options: UpdateOptions = { updateTimestamp: true }
): Promise<void> {
  const docData = options.updateTimestamp
    ? { ...data, updatedAt: new Date().toISOString() }
    : data;

  await updateDoc(doc(db, collectionName, docId) as any, docData as any);
}

export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, docId));
}

// ==================== PROPERTIES ====================

export async function createProperty(data: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<string> {
  return createDocument("properties", data);
}

export async function updateProperty(
  id: string,
  data: Partial<Property>
): Promise<void> {
  return updateDocument("properties", id, data);
}

export async function deleteProperty(id: string): Promise<void> {
  return deleteDocument("properties", id);
}

export async function getAllProperties(): Promise<(Property & { id: string })[]> {
  const q = query(
    collection(db, "properties"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Property & { id: string });
}

// ==================== VEHICLES ====================

export async function createVehicle(data: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Promise<string> {
  return createDocument("vehicles", data);
}

export async function updateVehicle(
  id: string,
  data: Partial<Vehicle>
): Promise<void> {
  return updateDocument("vehicles", id, data);
}

export async function deleteVehicle(id: string): Promise<void> {
  return deleteDocument("vehicles", id);
}

export async function getAllVehicles(): Promise<(Vehicle & { id: string })[]> {
  const q = query(
    collection(db, "vehicles"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Vehicle & { id: string });
}

// ==================== TRAININGS ====================

export async function createTraining(data: Omit<Training, "id" | "createdAt" | "updatedAt">): Promise<string> {
  return createDocument("trainings", data);
}

export async function updateTraining(
  id: string,
  data: Partial<Training>
): Promise<void> {
  return updateDocument("trainings", id, data);
}

export async function deleteTraining(id: string): Promise<void> {
  return deleteDocument("trainings", id);
}

export async function getAllTrainings(): Promise<(Training & { id: string })[]> {
  const q = query(
    collection(db, "trainings"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Training & { id: string });
}

// ==================== BLOG POSTS ====================

export async function createBlogPost(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<string> {
  return createDocument("blog_posts", data);
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<void> {
  return updateDocument("blog_posts", id, data);
}

export async function deleteBlogPost(id: string): Promise<void> {
  return deleteDocument("blog_posts", id);
}

export async function getAllBlogPosts(): Promise<(BlogPost & { id: string })[]> {
  const q = query(
    collection(db, "blog_posts"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as BlogPost & { id: string });
}

// ==================== PAGINATION HELPERS ====================

interface PaginationOptions {
  pageSize?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  filters?: Record<string, unknown>;
}

export async function getPaginatedDocuments<T extends Record<string, unknown>>(
  collectionName: string,
  options: PaginationOptions = {}
): Promise<{
  data: (T & { id: string })[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const { pageSize = 10, lastDoc, filters = {} } = options;

  let q = query(
    collection(db, collectionName),
    orderBy("createdAt", "desc"),
    limit(pageSize + 1)
  );

  // Appliquer les filtres
  Object.entries(filters).forEach(([field, value]) => {
    if (value !== undefined && value !== null) {
      q = query(q, where(field, "==", value));
    }
  });

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  const hasMore = docs.length > pageSize;

  return {
    data: docs.slice(0, pageSize).map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (T & { id: string })[],
    lastDoc: docs.length > 0 ? docs[Math.min(docs.length - 1, pageSize - 1)] : null,
    hasMore,
  };
}
