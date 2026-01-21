import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '10h',
    });
}

const generateAdminToken = (adminId) => {
    return jwt.sign({ id: adminId, role: 'admin' }, process.env.ADMIN_JWT_SECRET, {
        expiresIn: '1d',
    });
}

export { generateToken, generateAdminToken };