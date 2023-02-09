const {User, validate} = require("../models/user")
const {create} = require("../controller/create")
const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
router.get("/", async (req, res) => {
	const users = await User.find()

	res.send(users)
})
router.post("/", async (req, res) => {
	// 1. Validate the request body
	const {error} = validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	// 2. Check if the email is already registered
	let user = await User.findOne({email: req.body.email})
	if (user) return res.status(400).send("This email address is already registered")

	// 3. Create a new user
	user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	})

	// 4. Save the user to the database
	await user.save()

	// 5. Send the user to the client
	res.send(user)
})

module.exports = router
