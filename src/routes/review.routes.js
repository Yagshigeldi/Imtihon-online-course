import { Router } from "express";
import { ReviewController } from "../controllers/review.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { UserGuard } from "../middleware/user.guard.js";

const router = Router();
const controller = new ReviewController();

router
    .post('/', JwtAuthGuard, UserGuard, controller.createReview)
    .get('/', controller.getAllReviews)
    .get('/:id', controller.getReviewById)
    .patch('/:id', JwtAuthGuard, UserGuard, controller.updateReviewById)
    .delete('/:id', JwtAuthGuard, UserGuard, controller.deleteReviewById)

export default router;
