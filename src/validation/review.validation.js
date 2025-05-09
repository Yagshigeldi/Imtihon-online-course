import Joi from "joi";

export const reviewValidator = (data) => {
    const review = Joi.object({
        user_id: Joi.string().required(),
        course_id: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().min(5).max(500).required()
    });
    return review.validate(data);
}