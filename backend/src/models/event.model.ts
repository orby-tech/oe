import mongoose, { Schema } from "mongoose";
import { EventOnPoster } from "@common/types/event";

const schema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: false,
    },
    date: {
      type: Number,
      required: true,
    },
    durationsInSeconds: {
      type: Number,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    timezone: {
      required: false,
      timezoneName: {
        type: String,
        required: true,
      },
      timezoneOffset: {
        type: String,
        required: true,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.index({
  title: "text",
  description: "text",
  "location.city": "text",
  "location.country": "text",
});

const EventModel = mongoose.model<EventOnPoster>("Event", schema);
export default EventModel;
