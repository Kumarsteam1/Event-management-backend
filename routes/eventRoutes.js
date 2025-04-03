const express = require("express");
const authUser = require("../middleware/UserMiddleware"); // Middleware for JWT
const Event = require("../model/EventModel");

const router = express.Router();

// Protected route for creating an event
router.post("/create", authUser, async (req, res) => {
    try {
        const { eventTopic, password, hostName, description, date, time, period, timezone, duration } = req.body;

        // Check for missing fields
        if (!eventTopic || !password || !hostName || !description || !date || !time || !period || !timezone || !duration) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newEvent = await Event.create({
            eventTopic, password, hostName, description, date, time, period, timezone, duration, createdBy: req.user._id
        });

        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


/** GET API - Fetch All Events */
router.get("/", authUser, async (req, res) => {
	try {
			// Fetch all events created by the logged-in user
			const events = await Event.find({ createdBy: req.user._id });

			res.status(200).json({ events });
	} catch (error) {
			res.status(500).json({ error: error.message });
	}
});


/** GET API - Fetch a Single Event by ID */
router.get("/:id", authUser, async (req, res) => {
	try {
			const { id } = req.params;
			const event = await Event.findById(id);

			if (!event) {
					return res.status(404).json({ error: "Event not found" });
			}

			res.status(200).json({ event });
	} catch (error) {
			res.status(500).json({ error: error.message });
	}
});

// Update

router.put("/:id", authUser, async (req, res) => {
	try {
			const { id } = req.params;
			const { eventTopic, password, hostName, description, date, time, period, timezone, duration } = req.body;

			// Check if the event exists
			let event = await Event.findById(id);
			if (!event) {
					return res.status(404).json({ error: "Event not found" });
			}

			// Ensure only the event creator can update it
			if (event.createdBy.toString() !== req.user._id.toString()) {
					return res.status(403).json({ error: "Unauthorized to update this event" });
			}

			// Update event fields
			event.eventTopic = eventTopic || event.eventTopic;
			event.password = password || event.password;
			event.hostName = hostName || event.hostName;
			event.description = description || event.description;
			event.date = date || event.date;
			event.time = time || event.time;
			event.period = period || event.period;
			event.timezone = timezone || event.timezone;
			event.duration = duration || event.duration;

			// Save updated event
			const updatedEvent = await event.save();
			res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
	} catch (error) {
			res.status(500).json({ error: error.message });
	}
});

// DELETE API - Delete an Event by ID
router.delete("/:id", authUser, async (req, res) => {
	try {
			const { id } = req.params;

			// Find the event by ID
			const event = await Event.findById(id);
			if (!event) {
					return res.status(404).json({ error: "Event not found" });
			}

			// Ensure only the event creator can delete it
			if (event.createdBy.toString() !== req.user._id.toString()) {
					return res.status(403).json({ error: "Unauthorized to delete this event" });
			}

			// Delete the event
			await Event.findByIdAndDelete(id);

			res.status(200).json({ message: "Event deleted successfully" });
	} catch (error) {
			res.status(500).json({ error: error.message });
	}
});

module.exports = router;