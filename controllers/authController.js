import jwt from 'jsonwebtoken';
import authService from '../services/authService.js';

class AuthController {
  async register(req, res) {
    const { name, password, role, status, createdBy } = req.body;

    try {
      const result = await authService.register(name, password, role, status, createdBy);
      res.status(201).json({ message: 'User registered successfully!', user: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    console.log('hit login route');
    const { name, password } = req.body;

    try {
      const result = await authService.login(name, password);
      res.status(200).json({
        token: result.token,
        user: result.user,
        message: 'Login successful',
      });
    } catch (error) {
      const statusCode = error.status || 400; // Default to 400 if no status is provided
      res.status(statusCode).json({ error: error.message });
    }
  }

  verifyToken(req, res) {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Return the decoded user data
      res.status(200).json({ user: decoded });
    } catch (err) {
      res.status(403).json({ error: 'Invalid token' });
    }
  }
}

export default new AuthController();
