export interface Zone {
  id: string;
  name: string;
  description: string;
  atmosphere: string;
  center: { lat: number; lng: number };
  radius: number;
}

export interface PlaceHotel {
  placeId: string;
  name: string;
  rating: number;
  userRatingsTotal: number;
  priceLevel: number;
  vicinity: string;
  photoUrl: string | null;
}

export interface MapPlace {
  name: string;
  lat: number;
  lng: number;
  order: number;
  type: string;
  description: string;
}

export interface MapDayData {
  day: number;
  places: MapPlace[];
}
