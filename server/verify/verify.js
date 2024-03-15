const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    // Get the token from the request headers

    const { token } = req.headers;
    console.log('token', token)
    // Check if token is present
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        // Verify the token asynchronously
        const decoded = jwt.verify(token, 'secretKey1234');
        console.log('decoded', decoded)

        // Store decoded token data in request object for use in subsequent middleware or route handlers
        req.userId = decoded.userId; // Example: If userId is stored in the token payload

        // Call the next middleware function
        next();
    } catch (err) {
        // Handle verification errors
        return res.status(401).json({ message: 'Failed to authenticate token' });
    }
};

module.exports = verifyToken;
