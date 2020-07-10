import { Schema, model, Document } from "mongoose";
import crypto from "crypto";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set(v: string) {
      (this as any).encryptKey = crypto.randomBytes(64).toString("base64");
      const { encryptKey } = this as any;
      return crypto
        .pbkdf2Sync(v, encryptKey, 100000, 64, "sha512")
        .toString("base64");
    },
  },
  encryptKey: {
    type: String,
  },
});

export interface UserDocument extends Document {
  username: string;
  password: string;
  encryptKey: string;
}

const User = model<UserDocument>("user", userSchema);

export default User;
