import mongoose from "mongoose";

const RoleSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", RoleSchema);

export default Role;
