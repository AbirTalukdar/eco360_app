import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

class AuthService {
    async register(name, plainPassword, role, status, createdBy) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
        // Insert user into the database
        const query = `
          INSERT INTO users (name, password, role, status, created_by)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, name, role, status, created_at
        `;
        const values = [name, hashedPassword, role, status, createdBy];
    
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async login(name, password) {
        const userQuery = 'SELECT * FROM users WHERE name = $1';
        const userResult = await pool.query(userQuery, [name]);
        if (userResult.rows.length === 0) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        };
    }
}

export default new AuthService();
