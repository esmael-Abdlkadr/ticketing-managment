import { model, Schema } from "mongoose";
import { IComment } from "../types/types";

const commentSchema = new Schema<IComment>({
  text: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = model<IComment>("Comment", commentSchema);
