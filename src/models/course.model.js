import { model, Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
    {
        timestamps: true
    });

const Course = model("Course", courseSchema);
export default Course;