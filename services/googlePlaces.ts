import { requireServerEnv } from "@/lib/env";

export type PlaceResult = {
  placeId: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
};

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
};

export async function searchPlaces(query: string, quantity: number): Promise<PlaceResult[]> {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": requireServerEnv("GOOGLE_PLACES_API_KEY"),
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount"
    },
    body: JSON.stringify({
      textQuery: query,
      pageSize: Math.min(quantity, 20)
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Places failed: ${response.status} ${detail}`);
  }

  const payload = (await response.json()) as { places?: GooglePlace[] };

  return (payload.places ?? []).slice(0, quantity).map((place) => ({
    placeId: place.id ?? crypto.randomUUID(),
    name: place.displayName?.text ?? "Unnamed business",
    address: place.formattedAddress,
    phone: place.nationalPhoneNumber,
    website: place.websiteUri,
    rating: place.rating,
    reviews: place.userRatingCount
  }));
}
