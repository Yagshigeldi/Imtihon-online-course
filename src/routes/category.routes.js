import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";

const router = Router();
const controller = new CategoryController();

router
    .post('/', JwtAuthGuard, AdminGuard, controller.createCategory)
    .get('/', controller.getAllCategories)
    .get('/:id', controller.getCategoryById)
    .patch('/:id', JwtAuthGuard, AdminGuard, controller.updateCategoryById)
    .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteCategoryById)

export default router;