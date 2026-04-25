import { MetadataRoute } from "next";
import { adminDb } from "@/lib/firebase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sts-sofitrans.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/transport`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/immobilier`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/services/agrobusiness`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services/formation-comptabilite`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/hygiene-services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services/marketing-commerce`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const propertyRoutes: MetadataRoute.Sitemap = [];
    const blogRoutes: MetadataRoute.Sitemap = [];

    try {
      const propertiesSnapshot = await adminDb.collection("properties").get();
      propertiesSnapshot.docs.forEach((doc: any) => {
        propertyRoutes.push({
          url: `${baseUrl}/services/immobilier/${doc.id}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    } catch {
      // Ignore Firestore errors during sitemap generation
    }

    try {
      const blogSnapshot = await adminDb.collection("blog_posts").where("published", "==", true).get();
      blogSnapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        blogRoutes.push({
          url: `${baseUrl}/blog/${data.slug || doc.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    } catch {
      // Ignore
    }

    return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}