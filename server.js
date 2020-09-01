const express = require("express")
const cors = require("cors")

const morgan = require("morgan")
const router = require("./routes/router")
const app = express()

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("tiny"))    
// }

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({credentials: true, origin: '*'}));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

// app.use(morgan("tiny"))
// app.use("/uploads", express.static("uploads"))



if (app.get("env") === "development"){
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        return res.json({   
            message: err.message,
            error: err
        })
    })
}
app.use("/", router)
// const PORT = process.env.PORT || 3001
const port = process.env.PORT || 3001
app.listen(port, () => console.log(`App Started on port ${port}`))
// app.listen(PORT, console.log(`Server Started in ${process.env.NODE_ENV} on port ${PORT}`))
module.exports = app