import Joi from "joi";

export const userValidator = (data) => {
    const user = Joi.object({
        full_name: Joi.string().min(4).max(20).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(22).required(),
        role: Joi.string().valid('superadmin', 'admin', 'user', 'author').default('user')
    });
    return user.validate(data);
};