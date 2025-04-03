const User = require("../model/UserModel");
const createToken = require("../utils/Token");
const bcrypt = require("bcrypt");




const userLogin = async (req, res) => {
	const { mail, password } = req.body;
	console.log("Request Body:", req.body);
	try {
		const user = await User.login(mail, password);
		const token = createToken(user._id)
		res.status(200).json({ mail, user, token })
	} catch (err) {
		res.status(400).json({ Error: err.message })
	}
}

const userSignUp = async (req, res) => {
	const { mail, password, first_name, last_name } = req.body;
	console.log("Request Body:", req.body);
	try {
		const user = await User.signup(mail, password, first_name, last_name);
		const token = createToken(user._id)
		res.status(200).json({ mail, user, token })
	} catch (err) {
		res.status(400).json({ Error: err.message })
	}
}

// Get user details
const userDetails = async (req, res) => {
	try {
			// Ensure `req.user` is coming from JWT middleware
			if (!req.user) {
					return res.status(401).json({ error: "Unauthorized. Token missing or invalid." });
			}

			// Fetch user details using token's user ID
			const user = await User.findById(req.user._id).select(" -__v -createdAt -updatedAt");

			if (!user) {
					return res.status(404).json({ error: "User not found" });
			}

			res.status(200).json(user);
	} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
	}
};

const updateUser = async (req, res) => {
	try {
		if (!req.user) {
			console.log("❌ Unauthorized: No user found in request.");
			return res.status(401).json({ error: "Unauthorized. Token missing or invalid." });
		}

		console.log("🆔 User ID from token:", req.user._id);
		console.log("📩 Request Body:", req.body);

		const { first_name, last_name, mail, password } = req.body;

		// Validate if email is already taken
		if (mail) {
			const existingUser = await User.findOne({ mail });
			if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
				console.log("🚨 Email already in use by another user.");
				return res.status(400).json({ error: "Email is already in use" });
			}
		}

		// Prepare update object
		const updateData = {};
		if (first_name) updateData.first_name = first_name;
		if (last_name) updateData.last_name = last_name;
		if (mail) updateData.mail = mail;

		// Hash new password if provided
		if (password) {
			const salt = await bcrypt.genSalt(10);
			updateData.password = await bcrypt.hash(password, salt);
			console.log("✅ Password hashed successfully.");
		}

		// Update user details
		const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password -__v");

		if (!updatedUser) {
			console.log("❌ User not found in database.");
			return res.status(404).json({ error: "User not found" });
		}

		console.log("✅ User updated successfully:", updatedUser);
		res.status(200).json({ message: "User updated successfully", user: updatedUser });
	} catch (error) {
		console.error("🔥 Update User Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


module.exports = {
	userLogin,
	userSignUp,
	userDetails,
	updateUser
}