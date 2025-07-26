import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String },
    thumbnail: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Division = model<IDivision>("Division", divisionSchema);
