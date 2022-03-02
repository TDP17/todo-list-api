import jwt from 'jsonwebtoken';

const isAuthorized = (req, res, next) => {
    const cookieToken = req.cookies["jwt_token"];
    let decodedToken;
    if (!cookieToken)
        return res.status(401).json("Unauthorized user");
    else {
        try {
            decodedToken = jwt.verify(cookieToken, process.env.JWT_TOKEN);
        } catch (error) {
            return res.status(401).json("Token expired");
        }
        if (!decodedToken)
            return res.status(401).json("Unauthorized user");
        req.username = decodedToken.username;
        next();
    }
}

export default isAuthorized;