import Review from "../models/review.model.js";
import { reviewValidator } from "../validation/review.validation.js";
import { catchError } from "../utils/error-response.js";

export class ReviewController {
    async createReview(req, res) {
        try {
            const { error, value } = reviewValidator(req.body);
            if (error) {
                return catchError(res, 400, error);
            }
            const { user_id, course_id, rating, comment } = value;
            const review = await Review.create({
                user_id,
                course_id,
                rating,
                comment,
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: review,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAllReviews(_, res) {
        try {
            const reviews = await Review.find().populate('user_id, course_id');
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: reviews,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getReviewById(req, res) {
        try {
            const review = await ReviewController.findReviewById(res, req.params.id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: review,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateReviewById(req, res) {
        try {
            const id = req.params.id;
            await ReviewController.findReviewById(res, id);
            const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedReview,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteReviewById(req, res) {
        try {
            const id = req.params.id;
            await ReviewController.findReviewById(res, id);
            await Review.findByIdAndDelete(id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {},
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    static async findReviewById(res, id) {
        try {
            const review = await Review.findById(id).populate('user_id course_id');
            if (!review) {
                return catchError(res, 404, `Review not found by id: ${id}`);
            }
            return review;
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}