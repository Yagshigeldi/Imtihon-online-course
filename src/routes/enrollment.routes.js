import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { UserGuard } from "../middleware/user.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";

const router = Router();
const controller = new EnrollmentController();

router
    .post('/', JwtAuthGuard, UserGuard, controller.createEnrollment)
    .get('/', JwtAuthGuard, UserGuard, controller.getAllEnrollments)
    .get('/:id', JwtAuthGuard, UserGuard, controller.getEnrollmentById)
    .patch('/:id', JwtAuthGuard, AdminGuard, controller.updateEnrollmentById)
    .delete('/:id', JwtAuthGuard, UserGuard, controller.deleteEnrollmentById)

export default router;