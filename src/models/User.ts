import { Schema, model, Document } from "mongoose";
import crypto from "crypto";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set(v: string) {
      const { encryptKey } = this as any;
      return crypto
        .pbkdf2Sync(v, encryptKey, 100000, 64, "sha512")
        .toString("base64");
    },
  },
  encryptKey: {
    type: String,
    default() {
      return crypto.randomBytes(64).toString("base64");
    },
  },
});

interface UserDocument extends Document {
  username: string;
  password: string;
  encryptKey: string;
}

const User = model<UserDocument>("user", userSchema);

export default User;
