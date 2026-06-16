export type TimePref = "morning" | "afternoon" | "evening" | "any";

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export interface Profile {
  id: string;
  name: string;
  email: string | null;
  area: string | null;
  interests: string[];
  time_pref: TimePref;
  trial_ends_at: string;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort: number;
}

// Row shape returned by the recommend_activities() SQL function.
export interface RankedActivity {
  id: string;
  title: string;
  category: string;
  starts_at: string;
  place: string;
  area: string;
  capacity: number;
  host_name: string;
  attendee_count: number;
  joined: boolean;
  distance_km: number | null;
  score: number;
  reasons: string[];
}
