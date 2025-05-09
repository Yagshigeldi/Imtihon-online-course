import { model, Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
    },
},
    {
        timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}
    });

categorySchema.virtual('Course', {
    ref: 'Course',
    localField: '_id',
    foreignField: "category",
});

const Category = model("Category", categorySchema);
export default Category;