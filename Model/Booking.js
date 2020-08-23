const { validate } = require("jsonschema")
const dataSchema = require("../Schema/userScheme.json")
const bcrypt = require("bcrypt")
const db = require('../config/db')

function Booking(data) {
    this.data = data
    this.errors = []
}

Booking.prototype.validate = async function(){    
    const cleanData = validate(this.data, dataSchema)
    const { email } =  this.data

    if(!cleanData.valid) {       
        const err = cleanData.errors.map(err => err.stack)
        this.errors = err
        return err
    }

    return cleanData.instance
}

Booking.prototype.bookNow = function() {
    return new Promise(async (resolve, reject) => {
        const now = new Date()  
        const todaysDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
        const { checkin, checkout, userId, roomId } = this.data
        if(!this.errors.length){
            await db.query("INSERT INTO booking (checkin, checkout, userid, roomid, bookingdate) VALUES ($1, $2, $3, $4, $5)",
            [checkin, checkout, userId, roomId, todaysDate])
            resolve("Room Booked Succefully")
        }else{      
            reject(this.errors)
        }
    })
}

module.exports = Booking