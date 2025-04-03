const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors")
const port = 5000;



require("./db/Connections");


// Required Routes
const userRoutes = require("./routes/UserRoutes");
const eventRoutes = require("./routes/eventRoutes")


// MIDDLEWARES

app.use(express.json());

app.use(cors())

app.get("/", (req, res) => {
	res.send("Working")
})


app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes); 


app.listen(port, ()=>{
	console.log(`Server listening at PORT Number ${port}`)
})