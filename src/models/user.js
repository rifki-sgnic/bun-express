import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    roleName: { type: String, required: true },
    isVerify: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    deleted_at: { type: Date },
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);

export default User;
