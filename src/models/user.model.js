import { model, Schema } from "mongoose";

const userSchema = new Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["superadmin", "admin", "user", "author"],
        default: "user",
        required: true,
    },
},
    {
        timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}
    });

userSchema.virtual('Course', {
    ref: 'Course',
    localField: '_id',
    foreignField: "author",
});

const User = model("User", userSchema);
export default User;