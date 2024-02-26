const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.MONGO_URL); 

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    patient_id: {
      type: Number,
      required: true
    },
    taps: [
      {
        Tap_no: { type: Number, default:0 },
        median_inter_tap_1: { type: Number, default:0 },
        CorrectTap: { type: Number, default:0 },
        IncorrectTap: { type: Number, default:0 },
        median_inter_tap_2: { type: Number, default:0 },
        Offset_distance: { type: Number, default:0 }
      }
    ]
  });
  
// collection part
const collection = new mongoose.model("Patients", Loginschema);

module.exports = collection;


