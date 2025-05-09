import Joi from "joi";

export const courseValidator = (data) => {
    const course = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        author: Joi.string().required()
    });
    return course.validate(data);
};