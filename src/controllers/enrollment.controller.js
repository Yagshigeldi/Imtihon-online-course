import Enrollment from "../models/enrollment.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import { enrollmentValidator } from "../validation/enrollment.validation.js";
import { catchError } from "../utils/error-response.js";
import { otpGenerator } from "../utils/otp-generator.js";
import { transporter } from "../utils/mailer.js";
import { getCache, setCache } from "../utils/cache.js";

export class EnrollmentController {
    async createEnrollment(req, res) {
        try {
            const { error, value } = enrollmentValidator(req.body);
            if (error) {
                return catchError(res, 400, error);
            }
            const { course_id, user_id } = value;
            const course = await Course.findById(course_id);
            if (!course) {
                return catchError(res, 404, 'Course not found');
            }
            const user = await User.findById(user_id);
            if (!user) {
                return catchError(res, 404, 'User not found');
            }
            const existingEnrollment = await Enrollment.findOne({ course_id, user_id });
            if (existingEnrollment) {
                return catchError(res, 400, 'User already enrolled course');
            }
            const otp = otpGenerator();
            const mailMessage = {
                from: process.env.SMTP_USER,
                to: user.email,
                subject: 'online-course',
                text: otp
            }
            transporter.sendMail(mailMessage, function (err, info) {
                if (err) {
                    console.log('Error on sending to mail:', err);
                    return catchError(res, 400, err);
                }
                console.log(info);
                setCache(user.email, otp);
            });
            return res.status(200).json({
                statusCode: 201,
                message: 'OTP sent your email',
                data: {}
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async confirmEnrollment(req, res) {
        try {
            const { course_id, email, otp } = req.body;
            const course = await Course.findById(course_id);
            if (!course) {
                return catchError(res, 404, 'Course not found');
            }
            const user = await User.findOne({ email });
            if (!user) {
                return catchError(res, 404, 'User not found');
            }
            const otpCache = getCache(email);
            if (!otpCache || otp != otpCache) {
                return catchError(res, 400, 'Invalid expired OTP');
            }
            const enrollment = await Enrollment.create({
                course_id,
                user_id: user._id
            });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: enrollment
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