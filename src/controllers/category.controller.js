import Category from "../models/category.model.js";
import { categoryValidator } from "../validation/category.validation.js";
import { catchError } from "../utils/error-response.js";

export class CategoryController {
    async createCategory(req, res) {
        try {
            const { error, value } = categoryValidator(req.body);
            if (error) {
                return catchError(res, 400, error);
            };
            const { name, description } = value;
            const existName = await Category.findOne({ name });
            if (existName) {
                return catchError(res, 409, 'Name already exist');
            }
            const category = await Category.create({
                name,
                description,
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: category,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAllCategories(_, res) {
        try {
            const categories = await Category.find().populate('Course');
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: categories,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await CategoryController.findCategoryById(res, req.params.id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: category,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateCategoryById(req, res) {
        try {
            const id = req.params.id;
            await CategoryController.findCategoryById(res, id);
            const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedCategory,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteCategoryById(req, res) {
        try {
            const id = req.params.id;
            await CategoryController.findCategoryById(res, id);
            await Category.findByIdAndDelete(id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {},
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    static async findCategoryById(res, id) {
        try {
            const category = await Category.findById(id).populate('Course');
            if (!category) {
                return catchError(res, 404, `Category not found by id: ${id}`);
            }
            return category;
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}