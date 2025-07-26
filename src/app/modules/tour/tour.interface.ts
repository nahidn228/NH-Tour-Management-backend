import { Types } from "mongoose";

export interface ITour {
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  location?: string;
  coastFrom?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string;
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourTypes: Types.ObjectId;
}
