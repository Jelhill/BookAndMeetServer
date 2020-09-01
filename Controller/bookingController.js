const Booking = require("../Model/Booking")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET


exports.bookRoom = (req, res) => {
    const booking = new Booking(req.body)
    booking.bookNow()
    .then(() => res.send({status: "success"}))
    .catch(error => res.send({message: error}))
}


