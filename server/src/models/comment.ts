import { model, Schema } from "mongoose";
import { IComment } from "../types/types";

const commentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
    // Add these new fields for reply functionality
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replies: [{
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }],
  },
  {
    timestamps: true,
  }
);

export const Comment = model<IComment>("Comment", commentSchema);