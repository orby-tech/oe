import mongoose, { Schema } from "mongoose";
import { EventOnPoster } from "@common/types/event";

const InstanceScheme = new Schema(
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

const EventModel = mongoose.model<EventOnPoster>("Event", InstanceScheme);
export default EventModel;
