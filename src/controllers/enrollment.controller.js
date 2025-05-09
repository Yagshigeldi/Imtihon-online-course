import Enrollment from "../models/enrollment.model.js";
import { enrollmentValidator } from "../validation/enrollment.validation.js";
import { catchError } from "../utils/error-response.js";

export class EnrollmentController {
    async createEnrollment(req, res) {
        try {
            const { error, value } = enrollmentValidator(req.body);
            if (error) {
                return catchError(res, 400, error);
            }
            const { user_id, course_id } = value;
            const enrollment = await Enrollment.create({
                user_id,
                course_id,
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: enrollment,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAllEnrollments(_, res) {
        try {
            const enrollments = await Enrollment.find().populate('user_id course_id');
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: enrollments,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getEnrollmentById(req, res) {
        try {
            const enrollment = await EnrollmentController.findEnrollmentById(res, req.params.id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: enrollment,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateEnrollmentById(req, res) {
        try {
            const id = req.params.id;
            await EnrollmentController.findEnrollmentById(res, id);
            const updatedEnrollment = await Enrollment.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedEnrollment,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteEnrollmentById(req, res) {
        try {
            const id = req.params.id;
            await EnrollmentController.findEnrollmentById(res, id);
            await Enrollment.findByIdAndDelete(id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {},
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    static async findEnrollmentById(res, id) {
        try {
            const enrollment = await Enrollment.findById(id).populate('user_id course_id');
            if (!enrollment) {
                return catchError(res, 404, `Enrollment not found by id: ${id}`);
            }
            return enrollment;
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}