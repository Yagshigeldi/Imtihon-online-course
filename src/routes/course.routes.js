import { Router } from "express";
import { CourseController } from "../controllers/course.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";
import { AuthorGuard } from "../middleware/author.guard.js";

const router = Router();
const controller = new CourseController();

router
    .post('/', JwtAuthGuard, AuthorGuard, controller.createCourse)
    .get('/', controller.getAllCourses)
    .get('/filter', controller.getByFilter)
    .get('/:id', controller.getCourseById)
    .patch('/:id', JwtAuthGuard, AuthorGuard, controller.updateCourseById)
    .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteCourseById)

export default router;