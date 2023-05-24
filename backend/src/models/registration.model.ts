import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    telegramNickname: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: false,
    },
    profession: {
      type: String,
      required: true,
    },
    workplace: {
      type: String,
      required: true,
    },
    experienceInStartups: {
      type: String,
      required: true,
    },
    fromYouKnow: {
      type: String,
      required: true,
    },
    beenEarly: {
      type: String,
      required: true,
    },
    fromWhichCity: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    personaldataAgree: {
      type: Boolean,
      required: true,
    },
    feeAgree: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const RegistrationModel = mongoose.model<Registration>("Registration", schema);
export default RegistrationModel;
