import Joi from "joi";

export const categoryValidator = (data) => {
    const category = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().max(500)
    });
    return category.validate(data);
};