const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    eventTopic: { type: String, required: true },
    password: { type: String, required: true },
    hostName: { type: String, default: "Sarthak Pal" }, // Default host name
    description: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    period: { type: String, required: true },
    timezone: { type: String, required: true },
    duration: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link event to user
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
