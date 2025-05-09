import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course_id: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    });

const Review = model("Review", reviewSchema);
export default Review;