const { validate } = require("jsonschema")
const dataSchema = require("../Schema/userScheme.json")
const bcrypt = require("bcrypt")
const db = require('../config/db')

function User(data) {
    this.data = data
    this.errors = []
}

User.prototype.validate = async function(){    
    const cleanData = validate(this.data,dataSchema)

    if(!cleanData.valid) {       
        const err = cleanData.errors.map(err => err.stack)
        this.errors = err
        return err
    }

    return cleanData.instance
}

User.prototype.checkExistingEmail = async function() {
    return new Promise(async (resolve, reject) => {
        const { email } = this.data
        const userExist = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if(userExist.rowCount > 0) {
            this.errors.push("Email has already been taken")
        }
        resolve()
    })
}

User.prototype.signUp = function() {
    return new Promise(async (resolve, reject) => {      
        await this.validate()
        await this.checkExistingEmail()
        const {surname, firstname, email, password, confirmPassword} = this.data;

        if(!this.errors.length){            
            if(password !== confirmPassword) {
                reject("Password Mismatch")
            }else{
                const salt = bcrypt.genSaltSync(10)
                const hashPassword = bcrypt.hashSync(password, salt)
                db.query("INSERT INTO users (surname, firstname, password, email) VALUES ($1, $2, $3, $4)", 
                [surname, firstname, hashPassword, email])
                resolve("Successfully Updated")
            }           
        }else{
            console.log("This Errors", this.errors)
            reject(this.errors)
        }        
    })
}
// User.prototype.adminsignUp = function() {
//     return new Promise(async (resolve, reject) => {      
//         // await this.validate()
//         // await this.checkExistingEmail()
//         console.log('data', this.data);
//         const {firstname, lastname, email, staffcode, department, password,tandc} = this.data;

//         if(!this.errors.length){            
//                 const salt = bcrypt.genSaltSync(10)
//                 console.log('salt', salt);
//                 const hashPassword = bcrypt.hashSync(password, salt)
//                 db.query("INSERT INTO adminpersonnel (firstname, lastname, email, staffcode, department, password,tandc) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
//                 [firstname, lastname, email, staffcode, department, hashPassword,tandc])
//                 resolve("Successfully Updated")
//             }           
//         else{
//             console.log("This Errors", this.errors)
//             reject(this.errors)
//         }        
//     })
// }

User.prototype.authenticateUser = function() {
    return new Promise((resolve, reject) => {
        const {email, password} = this.data
            db.query("SELECT * FROM users WHERE email = $1", [email])
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


module.exports = User