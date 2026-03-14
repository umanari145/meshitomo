export type EventStatus = "recruiting" | "confirmed" | "completed";

export type GenderFilter = "anyone" | "same" | "male" | "female";

export type Event = {
  id: string;
  title: string;
  restaurant: string;
  address: string;
  date: string;
  time: string;
  area: string;
  category: string;
  subCategory: string;
  budget: string;
  currentMembers: number;
  maxMembers: number;
  genderFilter: GenderFilter;
  status: EventStatus;
  host: {
    nickname: string;
    ageGroup: string;
    gender: string;
    trustScore: number;
  };
  participants: {
    nickname: string;
    ageGroup: string;
    gender: string;
  }[];
};

export type EventSummary = Pick<
  Event,
  | "id"
  | "title"
  | "restaurant"
  | "date"
  | "area"
  | "budget"
  | "currentMembers"
  | "maxMembers"
  | "status"
>;
