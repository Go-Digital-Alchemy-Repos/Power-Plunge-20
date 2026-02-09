import { Router, Request, Response } from "express";
import { storage } from "../../../storage";

const router = Router();

let reviewsCache: { data: any; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000;

router.get("/", async (req: Request, res: Response) => {
  try {
    if (reviewsCache && Date.now() - reviewsCache.fetchedAt < CACHE_TTL_MS) {
      return res.json(reviewsCache.data);
    }

    const settings = await storage.getIntegrationSettings();
    if (!settings?.googlePlacesConfigured || !settings.googlePlacesApiKeyEncrypted || !settings.googlePlacesId) {
      return res.json({ reviews: [], configured: false });
    }

    const { decrypt } = await import("../../utils/encryption");
    const apiKey = decrypt(settings.googlePlacesApiKeyEncrypted);
    const placeId = settings.googlePlacesId;

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("[GooglePlaces] API error:", data.status, data.error_message);
      return res.json({ reviews: [], configured: true, error: data.status });
    }

    const allReviews = data.result?.reviews || [];
    const fiveStarReviews = allReviews
      .sort((a: any, b: any) => b.time - a.time)
      .map((r: any) => ({
        author: r.author_name,
        avatar: r.profile_photo_url || "",
        rating: r.rating,
        text: r.text,
        relativeTime: r.relative_time_description,
        time: r.time,
      }));

    const result = {
      reviews: fiveStarReviews,
      configured: true,
      overallRating: data.result?.rating || 0,
      totalReviews: data.result?.user_ratings_total || 0,
    };

    reviewsCache = { data: result, fetchedAt: Date.now() };

    res.json(result);
  } catch (error: any) {
    console.error("[GooglePlaces] Failed to fetch reviews:", error.message);
    res.status(500).json({ reviews: [], error: "Failed to fetch reviews" });
  }
});

export default router;
