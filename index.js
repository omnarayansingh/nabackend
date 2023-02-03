import express, { response } from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())


app.use(cors({
  origin: 'https://nafrontend.vercel.app',
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type']
}));

const uri = "mongodb+srv://om:1234om@cluster0.dztj6bc.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
    
const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String
  })
  
const User = new mongoose.model("User", userSchema)
  

app.post("/login", (req, res)=> {
      const { email, password} = req.body
      User.findOne({ email: req.body.email}, (err, user) => {
          if(user){
              if(password === user.password ) {
                  res.send({message: "Login Successfull", user: user})
              } else {
                  res.send({ message: "Password didn't match"})
              }
          } else {
              res.send({message: "User not registered"})
          }
      })
  }) 

  app.post("/register", async(req, res)=> {
      const { name, email, password} = req.body
      let user = await User.findOne({email: req.body.email })
      console.log(user)  
      if(user){
        res.send({message: "User already registerd"})
        } else {
        user = new User({
            name,
            email,
            password
        })
        await user.save()
        res.send({message: "successfuly register login now"})
       
    }
    })  
  const port = process.env.PORT || 9002;

  app.listen(9002,() => {
      console.log("BE started at port 9002")
  })
