import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { SuperAdminGuard } from "../middleware/superAdmin.guard.js";
import { UserGuard } from "../middleware/user.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";
import { AuthorGuard } from "../middleware/author.guard.js";

const router = Router();
const controller = new UserController();

router.post('/auth/signin', controller.signin);
router.post('/auth/confirm-signin', controller.confirmSignIn);
router.post('/auth/token', controller.accessToken);
router.post('/auth/signout', controller.signout);

router.post('/superadmin', controller.createSuperAdmin);
router.get('/superadmin/:id', controller.getUserById);
router.patch('/superadmin/:id', JwtAuthGuard, SuperAdminGuard, controller.updateAdminById);

router.post('/admin', JwtAuthGuard, SuperAdminGuard, controller.createAdmin);
router.get('/admins', JwtAuthGuard, SuperAdminGuard, controller.getAllAdmins);
router.get('/admin/:id', JwtAuthGuard, AdminGuard, controller.getUserById);
router.patch('/admin/:id', JwtAuthGuard, AdminGuard, controller.updateAdminById);
router.delete('/admin/:id', JwtAuthGuard, SuperAdminGuard, controller.deleteAdminById);

router.post('/user', JwtAuthGuard, UserGuard, controller.createUser);
router.get('/users', JwtAuthGuard, AdminGuard, controller.getAllUsers);
router.get('/user/:id', JwtAuthGuard, UserGuard, controller.getUserById);
router.patch('/user/:id', JwtAuthGuard, UserGuard, controller.updateAdminById);
router.delete('/user/:id', JwtAuthGuard, AdminGuard, controller.deleteAdminById);

router.post('/author', JwtAuthGuard, AuthorGuard, controller.createAuthor);
router.get('/authors', JwtAuthGuard, AdminGuard, controller.getAllAuthors);
router.get('/author/:id', JwtAuthGuard, AuthorGuard, controller.getUserById);
router.patch('/author/:id', JwtAuthGuard, AuthorGuard, controller.updateAdminById);
router.delete('/author/:id', JwtAuthGuard, AdminGuard, controller.deleteAdminById);

export default router;