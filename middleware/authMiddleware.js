const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
    // Get token from Authorization header
    const token = req.headers['authorization']

    // check if the header is missing or does not start with 'Bearer '
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    // Extract the token by removing 'Bearer ' prefix
    const authToken = token.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        
        // Attach user information to the request object
        req.user = decoded;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
module.exports = authMiddleware;