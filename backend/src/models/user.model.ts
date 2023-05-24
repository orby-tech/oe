import mongoose, { CallbackError, Schema } from "mongoose";
import { createHash } from "node:crypto";

const schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    telegram: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: false,
    },
    profession: {
      type: String,
      default: false,
    },
    email: {
      type: String,
      default: false,
    },
    personaldataAgree: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = createHash("sha256")
      .update(String(this.password))
      .digest("base64");

    return next();
  } catch (error) {
    return next(error as CallbackError);
  }
});

const UserModel = mongoose.model<User>("User", schema);
export default UserModel;
