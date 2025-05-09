import { catchError } from '../utils/error-response.js';

export const UserGuard = (req, res, next) => {
    try {
        const user = req?.user;

        if (!req.params?.id && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'user')) {
            return next();
        } else if (user.role === 'superadmin' || user.role === 'admin' || (user.role === 'user' && user.id == req.params?.id)) {
            return next();
        } else {
            return catchError(res, 403, 'Forbidden user');
        }
    } catch (error) {
        return catchError(res, 500, error.message);
    }
};