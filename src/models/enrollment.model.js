import { model, Schema } from "mongoose";

const enrollmentSchema = new Schema({
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
},
    {
        timestamps: true
    });

const Enrollment = model("Enrollment", enrollmentSchema);
export default Enrollment;