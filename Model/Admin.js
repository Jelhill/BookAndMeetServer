const { validate } = require("jsonschema")
const dataSchema = require("../Schema/userScheme.json")
const bcrypt = require("bcrypt")
const db = require('../config/db')

function Admin(data) {
    this.data = data
    this.errors = []
}

Admin.prototype.validate = async function(){    
    const cleanData = validate(this.data, dataSchema)
    const { email } =  this.data

    if(!cleanData.valid) {       
        const err = cleanData.errors.map(err => err.stack)
        this.errors = err
        return err
    }

    return cleanData.instance
}

Admin.prototype.checkExistingEmail = function() {
    return new Promise(async (resolve, reject) => {
        const { email } = this.data
        const userExist = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if(userExist.rowCount > 0) {
            this.errors.push("Email has already been taken")
        }
        resolve()
    })
}

Admin.prototype.addRoom = function() {
    return new Promise(async (resolve, reject) => {      
        const now = new Date()  
        const todaysDate = `${now.getDay()}/${now.getMonth() + 1}/${now.getFullYear()}`
        const {type, location, capacity, name, isavailable, hasprojector, hasaircondition, haswaterdispenser, haswhiteboard, secure_url} = this.data;
        if(!this.errors.length){            
            db.query("INSERT INTO rooms (type, location, capacity, name, isavailable, hasprojector, hasaircondition, haswaterdispenser, haswhiteboard, imageurl, datecreated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
            [type, location, capacity, name, isavailable, hasprojector, hasaircondition, haswaterdispenser, haswhiteboard, secure_url, todaysDate])
            resolve("Successfully Updated")
        }else{
            console.log("This Errors", this.errors)
            reject(this.errors)
        }        
    })
}
// Admin.prototype.editRoom = function() {
//     return new Promise(async (resolve, reject) => {
//         const {type, location, capacity, name, available, hasProjector, hasAirCondition, hasWaterDispenser, hasWhiteBoard, secure_url} = this.data;
//         if(!this.errors.length){            
//             db.query("UPDATE rooms set type = $1, location = $2, capacity =$3, name = $4, isavailable = $5, hasprojector = $6, hasaircondition = $7, haswaterdispenser = $8, haswhiteboard = $9, imageurl = $10, datecreated = $11 WHERE id = $12) RETURNING *", 
//             [type, location, capacity, name, available, hasProjector, hasAirCondition, hasWaterDispenser, hasWhiteBoard, secure_url, todaysDate])
//             resolve("Successfully Updated")
//         }else{
//             console.log("This Errors", this.errors)
//             reject(this.errors)
//         } 
//     })
// }

Admin.prototype.adminsignUp = function() {
    return new Promise(async (resolve, reject) => {      
        // await this.validate()
        // await this.checkExistingEmail()
        const now = new Date()  
        const todaysDate = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
        console.log('date', todaysDate);
        const {firstname, surname, email, department, password} = this.data;

        if(!this.errors.length){            
                const salt = bcrypt.genSaltSync(10)
                console.log('salt', salt);
                const hashPassword = bcrypt.hashSync(password, salt)
                db.query("INSERT INTO admin (firstname, surname, email, department, password, date) VALUES ($1, $2, $3, $4, $5, $6)", 
                [firstname, surname, email, department, hashPassword, todaysDate])
                resolve("Successfully Updated")
            }           
        else{
            console.log("This Errors", this.errors)
            reject(this.errors)
        }        
    })
}

Admin.prototype.authenticateUser = function() {
    return new Promise((resolve, reject) => {
        const {email, password} = this.data
            db.query("SELECT * FROM admin WHERE email = $1", [email])
            .then((result) => {
                if(result && bcrypt.compareSync(password, result.rows[0].password)){
                    this.data = result
                    resolve({message: "Successful", result: result.rows[0]})
                }
                else{
                    reject("username/password mismatch")
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}



module.exports = Admin