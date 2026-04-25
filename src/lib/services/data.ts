import { getAdminDb } from "@/lib/firebase/admin";
import { unstable_cache } from "next/cache";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { DocumentData } from "firebase-admin/firestore";
import type {
  Property,
  Vehicle,
  Training,
  BlogPost,
  Quote,
  Booking,
  Message
} from "@/types";

// Types pour les réponses paginées
interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  lastDoc: string | null;
}

// ==================== PROPERTIES ====================

export const getProperties = unstable_cache(
  async (limit = 10, lastDoc?: string): Promise<PaginatedResult<Property & { id: string }>> => {
    const db = await getAdminDb();
    if (!db) return { data: [], hasMore: false, lastDoc: null };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let query = db!
      .collection("properties")
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (lastDoc) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastDocSnapshot = await db!.collection("properties").doc(lastDoc).get();
      if (lastDocSnapshot.exists) {
        query = query.startAfter(lastDocSnapshot);
      }
    }

    const snapshot = await query.get();
    const properties = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Property & { id: string })[];

    return {
      data: properties,
      hasMore: properties.length === limit,
      lastDoc: properties.length > 0 ? properties[properties.length - 1].id : null,
    };
  },
  ["properties"],
  { revalidate: 60, tags: ["properties"] }
);

export const getPropertyById = unstable_cache(
  async (id: string): Promise<(Property & { id: string }) | null> => {
    const doc = await getAdminDb().collection("properties").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Property & { id: string };
  },
  ["property"],
  { revalidate: 60, tags: ["properties"] }
);

export const getFeaturedProperties = unstable_cache(
  async (limit = 6): Promise<(Property & { id: string })[]> => {
    const snapshot = await getAdminDb()
      .collection("properties")
      .where("featured", "==", true)
      .where("status", "==", "available")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Property & { id: string })[];
  },
  ["featured-properties"],
  { revalidate: 300, tags: ["properties"] }
);

// ==================== VEHICLES ====================

export const getVehicles = unstable_cache(
  async (limit = 10, lastDoc?: string): Promise<PaginatedResult<Vehicle & { id: string }>> => {
    const db = await getAdminDb();
    if (!db) return { data: [], hasMore: false, lastDoc: null };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let query = db!
      .collection("vehicles")
      .where("status", "==", "available")
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (lastDoc) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastDocSnapshot = await db!.collection("vehicles").doc(lastDoc).get();
      if (lastDocSnapshot.exists) {
        query = query.startAfter(lastDocSnapshot);
      }
    }

    const snapshot = await query.get();
    const vehicles = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Vehicle & { id: string })[];

    return {
      data: vehicles,
      hasMore: vehicles.length === limit,
      lastDoc: vehicles.length > 0 ? vehicles[vehicles.length - 1].id : null,
    };
  },
  ["vehicles"],
  { revalidate: 60, tags: ["vehicles"] }
);

export const getVehicleById = unstable_cache(
  async (id: string): Promise<(Vehicle & { id: string }) | null> => {
    const db = await getAdminDb();
    if (!db) return null;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const doc = await db!.collection("vehicles").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Vehicle & { id: string };
  },
  ["vehicle"],
  { revalidate: 60, tags: ["vehicles"] }
);

// ==================== TRAININGS ====================

export const getTrainings = unstable_cache(
  async (limit = 10, lastDoc?: string): Promise<PaginatedResult<Training & { id: string }>> => {
    const db = await getAdminDb();
    if (!db) return { data: [], hasMore: false, lastDoc: null };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let query = db!
      .collection("trainings")
      .where("status", "==", "active")
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (lastDoc) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastDocSnapshot = await db!.collection("trainings").doc(lastDoc).get();
      if (lastDocSnapshot.exists) {
        query = query.startAfter(lastDocSnapshot);
      }
    }

    const snapshot = await query.get();
    const trainings = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Training & { id: string })[];

    return {
      data: trainings,
      hasMore: trainings.length === limit,
      lastDoc: trainings.length > 0 ? trainings[trainings.length - 1].id : null,
    };
  },
  ["trainings"],
  { revalidate: 300, tags: ["trainings"] }
);

export const getTrainingById = unstable_cache(
  async (id: string): Promise<(Training & { id: string }) | null> => {
    const db = await getAdminDb();
    if (!db) return null;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const doc = await db!.collection("trainings").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Training & { id: string };
  },
  ["training"],
  { revalidate: 300, tags: ["trainings"] }
);

// ==================== BLOG POSTS ====================

export const getBlogPosts = unstable_cache(
  async (limit = 10, lastDoc?: string): Promise<PaginatedResult<BlogPost & { id: string }>> => {
    const db = await getAdminDb();
    if (!db) return { data: [], hasMore: false, lastDoc: null };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let query = db!
      .collection("blog_posts")
      .where("published", "==", true)
      .orderBy("publishedAt", "desc")
      .limit(limit);

    if (lastDoc) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastDocSnapshot = await db!.collection("blog_posts").doc(lastDoc).get();
      if (lastDocSnapshot.exists) {
        query = query.startAfter(lastDocSnapshot);
      }
    }

    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    })) as (BlogPost & { id: string })[];

    return {
      data: posts,
      hasMore: posts.length === limit,
      lastDoc: posts.length > 0 ? posts[posts.length - 1].id : null,
    };
  },
  ["blog-posts"],
  { revalidate: 300, tags: ["blog"] }
);

export const getBlogPostBySlug = unstable_cache(
  async (slug: string): Promise<(BlogPost & { id: string }) | null> => {
    const db = await getAdminDb();
    if (!db) return null;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const snapshot = await db!
      .collection("blog_posts")
      .where("slug", "==", slug)
      .where("published", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost & { id: string };
  },
  ["blog-post"],
  { revalidate: 300, tags: ["blog"] }
);

export const getRelatedPosts = unstable_cache(
  async (category: string, excludeId: string, limit = 3): Promise<(BlogPost & { id: string })[]> => {
    const db = await getAdminDb();
    if (!db) return [];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const snapshot = await db!
      .collection("blog_posts")
      .where("category", "==", category)
      .where("published", "==", true)
      .orderBy("publishedAt", "desc")
      .limit(limit + 1)
      .get();

    return snapshot.docs
      .filter((doc: QueryDocumentSnapshot<DocumentData>) => doc.id !== excludeId)
      .slice(0, limit)
      .map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as (BlogPost & { id: string })[];
  },
  ["related-posts"],
  { revalidate: 300, tags: ["blog"] }
);

// ==================== ADMIN DASHBOARD ====================

export async function getDashboardStats(): Promise<{
  totalMessages: number;
  unreadMessages: number;
  pendingQuotes: number;
  pendingBookings: number;
  totalProperties: number;
  totalVehicles: number;
}> {
  const db = await getAdminDb();
  if (!db) return { totalMessages: 0, unreadMessages: 0, pendingQuotes: 0, pendingBookings: 0, totalProperties: 0, totalVehicles: 0 };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [
    messagesSnap,
    unreadMessagesSnap,
    pendingQuotesSnap,
    pendingBookingsSnap,
    propertiesSnap,
    vehiclesSnap,
  ] = await Promise.all([
    db!.collection("messages").count().get(),
    db!.collection("messages").where("status", "==", "new").count().get(),
    db!.collection("quotes").where("status", "==", "pending").count().get(),
    db!.collection("bookings").where("status", "==", "pending").count().get(),
    db!.collection("properties").count().get(),
    db!.collection("vehicles").count().get(),
  ]);

  return {
    totalMessages: messagesSnap.data().count,
    unreadMessages: unreadMessagesSnap.data().count,
    pendingQuotes: pendingQuotesSnap.data().count,
    pendingBookings: pendingBookingsSnap.data().count,
    totalProperties: propertiesSnap.data().count,
    totalVehicles: vehiclesSnap.data().count,
  };
}

export async function getRecentMessages(limit = 5): Promise<(Message & { id: string })[]> {
  const snapshot = await getAdminDb()
    .collection("messages")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Message & { id: string })[];
}

export async function getRecentQuotes(limit = 5): Promise<(Quote & { id: string })[]> {
  const snapshot = await getAdminDb()
    .collection("quotes")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Quote & { id: string })[];
}

export async function getRecentBookings(limit = 5): Promise<(Booking & { id: string })[]> {
  const snapshot = await getAdminDb()
    .collection("bookings")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Booking & { id: string })[];
}

// ==================== CACHE INVALIDATION ====================

export async function revalidateProperties(): Promise<void> {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("properties");
}

export async function revalidateVehicles(): Promise<void> {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("vehicles");
}

export async function revalidateTrainings(): Promise<void> {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("trainings");
}

export async function revalidateBlog(): Promise<void> {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("blog");
}
