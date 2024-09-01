import jwt from "jsonwebtoken";




export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
		httpOnly: true, // Prevent XSS attacks
		sameSite: "strict", // Prevent CSRF attacks
		secure: false, // Set to true in production if using HTTPS
		path: "/", // Ensure this matches when clearing the cookie
	});
};
//