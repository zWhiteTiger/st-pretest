import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
        },
        password: String,
        role: {
            type: String,
            enum: ["GUEST", "FLOORSTAFF", "TEAMLEADER", "MANAGER"],
            default: "GUEST",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);