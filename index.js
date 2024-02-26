require('dotenv').config()

const express = require("express");
const path = require("path");
const collection = require("./PatientSchema");
const bodyParser = require("body-parser");
const app = express();
// convert data into json format
app.use(express.json());

//app.use(bodyParser.json());

// Register User
app.post("/signup",  async (req, res) => {

    const data = {
        patient_id: req.body.patient_id 
    }
try{
    const id = await collection.findOne(data);
     
        if(!id){
     const userdata = await collection.insertMany(data);
     res.status(200).JSON(stringify(userdata));
     return ;
     
        }
        else {
               res.status(200) ;
               return ;
        } 
}
 catch(err){  
    res.status(500) ;
 }
        
});

// Login user 
// app.post("/login", async (req, res) => {
//      const query = {
//         patient_id: req.body.patient_id 
//      }

//      const result = await collection.findOne(query);

//         if(result != null){
//             const objToSend ={
//                 patient_id: result.patient_id
                
//             }
//             res.status(200).send(JSON.stringify(objToSend));
//         }   
//         else{
//             res.status(404).send(); 
//         } 
     
// });
    
app.post("/tapping", async (req, res) => {
  const query = {
      patient_id: req.body.patient_id,
  };

  const update = {
      $push: {
          taps: {
              Tap_no: req.body.tap_no,
              median_inter_tap_1: req.body.median_inter_tap_1,
              CorrectTap: req.body.correct_tap,
              IncorrectTap: req.body.incorrect_tap,
              median_inter_tap_2: req.body.median_inter_tap_2,
              Offset_distance: req.body.offset_distance
          }
      }
  };

  try {
      const result = await collection.findOneAndUpdate(query, update, { upsert: true, new: true });
      res.status(200).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});

app.get("/tapping", async (req, res) => {
  const patientId = req.body.patient_id;

  try {
      const result = await collection.findOne({ patient_id: patientId });
      
      if (result) {
          res.status(200).json(result.taps);
      } else {
          res.status(404).send("Patient not found");
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});
  
  
    




// Define Port for Application
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
