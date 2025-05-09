import Course from "../models/course.model.js";
import Category from "../models/category.model.js";
import { courseValidator } from "../validation/course.validation.js";
import { catchError } from "../utils/error-response.js";

export class CourseController {
    async createCourse(req, res) {
        try {
            const { error, value } = courseValidator(req.body);
            if (error) {
                return catchError(res, 400, error);
            }
            const { title, description, price, category, author } = value;
            const existTitle = await Course.findOne({ title });
            if (existTitle) {
                return catchError(res, 409, 'Title already exist');
            }
            const course = await Course.create({
                title,
                description,
                price,
                category,
                author,
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: course,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAllCourses(_, res) {
        try {
            const courses = await Course.find().populate('category author');
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: courses,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getByFilter(req, res) {
        try {
            const { category, price } = req.query
            const categoryData = await Category.findOne({ name: category });
            const courses = await Course.find({
                price: parseFloat(price),
                category: categoryData._id
            }).populate('category').populate('author');
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: courses
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getCourseById(req, res) {
        try {
            const course = await CourseController.findCourseById(res, req.params.id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: course,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateCourseById(req, res) {
        try {
            const id = req.params.id;
            await CourseController.findCourseById(res, id);
            const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedCourse,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteCourseById(req, res) {
        try {
            const id = req.params.id;
            await CourseController.findCourseById(res, id);
            await Course.findByIdAndDelete(id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {},
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    static async findCourseById(res, id) {
        try {
            const course = await Course.findById(id).populate('category');
            if (!course) {
                return catchError(res, 404, `Course not found by id: ${id}`);
            }
            return course;
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}