require('dotenv').config()

const express = require("express");
const path = require("path");
const collection = require("./PatientSchema");
const bodyParser = require("body-parser");
const app = express();
// convert data into json format
app.use(express.json());
app.use(express.urlencoded({extended:false}))

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
            res.status(200).json(userdata);
            return ;
        }
        else {
            res.status(200).send("User already exists");
            return ;
        } 
}
 catch(err){
     res.status(500).send(err.message);
}
        
});


    
app.post("/tapping", async (req, res) => {
    try {
        const { patient_id, tap_no, median_inter_tap_1, correct_tap, incorrect_tap, median_inter_tap_2, offset_distance } = req.body;

        // Construct query to find the patient
        const query = { patient_id };

        // Construct update operation to push tapping data into the taps array
        const update = {
            $push: {
                taps: {
                    Tap_no: tap_no,
                    median_inter_tap_1: median_inter_tap_1,
                    CorrectTap: correct_tap,
                    IncorrectTap: incorrect_tap,
                    median_inter_tap_2: median_inter_tap_2,
                    Offset_distance: offset_distance
                }
            }
        };

        // Options for upsert and returning new document
        const options = { upsert: true, new: true };

        // Perform update operation
        const result = await collection.findOneAndUpdate(query, update, options);

        // Send response
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
