const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
	first_name:{
		type:String,
		required:true,
	},
	last_name:{
		type:String,
		required:true,
	},
	mail: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
}, { timestamps: true });


// Static Signup Function
userSchema.statics.signup = async function (mail, password, first_name, last_name) {
	// Check if mail exists
	const exists = await this.findOne({ mail });
	if (exists) {
			throw Error("Mail ID already exists");
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	// Create user with all required fields
	const user = await this.create({ first_name, last_name, mail, password: hash });
	return user;
};


userSchema.statics.login = async(mail, password) =>{
	const user = await User.findOne({mail});

	if(!user){
		throw Error("Incorrect Mail")
	}

	const match = await bcrypt.compare(password, user.password);
	if(!match){
		throw Error ("Incorrect Password")
	}

	return user;
}

const User = new mongoose.model("User", userSchema);

module.exports = User;