const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/finalproject")

	.then(() => {
		console.log("Connected to DB Successfully!!!")
	}).catch((err) => {
		console.log(err)
	})

