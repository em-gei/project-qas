// Import dependencies
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { patients } from "./schema";

const router = express.Router();

// Get database URL from docker-compose
// const dbHost = "mongodb://localhost:27017/healthcare-system"; // use this when run server and database separately
const dbHost = "mongodb://mongodb/healthcare-system"; // use this when running docker-compose
// Connect to DB
mongoose.connect(dbHost);
mongoose.set('useFindAndModify', false); // Make Mongoose use `findOneAndUpdate()`, this option is `true` by default, need to set it to false.
const patientsSchema = new mongoose.Schema(patients);

// Create mongoose model
const Patients = mongoose.model("Patients", patientsSchema);

function sendError(res: Response, error: any) {
  res.status(500).send(error);
}

// TEST api listing
router.get("/", (req: Request, res: Response) => {
  res.send("api works");
});

// ************** Patient API **************
// Get all
router.get("/patients", (req: Request, res: Response) => {
  Patients.find({}, (err, gino) => {
    if (err) res.status(500).send(err);

    res.status(200).json(gino);
  });
});

// GET - Find in registry
router.get("/patients/:id", (req: Request, res: Response) => {
  Patients.findById(req.params["id"], (err: any, patient: any) => {
    if (err) res.status(500).send(err);

    res.status(200).json(patient);
  });
});

// POST Create a registry entry
router.post("/patients", async (req: Request, res: Response) => {
  let name = req.body.name;
  let surname = req.body.surname;
  let fiscalCode = req.body.fiscalCode;
  let birthday = req.body.birthday;
  let email = req.body.email;
  if (name && surname && fiscalCode && birthday && email) {
    let patient = new Patients({
      name: name,
      surname: surname,
      fiscalCode: fiscalCode,
      birthday: birthday,
      email: email,
    });
    let isAlready = await Patients.find({fiscalCode: fiscalCode}).exec();
    if (isAlready.length > 0) {
      res.status(403).json({
        status: 403,
        message: "Patient already exists"
      });
    } else {
      patient.save((error: any) => {
        if (error) sendError(res, error);
            
        res.status(201).json({
          status: 201,
          message: "Patient created successfully",
        });
      });
    }
    
  } else {
    sendError(res, "Fields not valid");
  }

});

// DELETE
router.delete("/patients/:id", (req: Request, res: Response) => {
  Patients.findByIdAndDelete(
    req.params["id"],
    null,
    (err: any, doc: any, resp: any) => {
      if (err) res.status(500).send(err);

      res.status(200).json({
        status: 200,
        message: "Patient succesfully deleted"
      });
    }
  );
});

// PUT
router.put("/patients/:id", (req: Request, res: Response) => {
  Patients.findByIdAndUpdate(req.params['id'], req.body, (err: any, doc:any, resp: any) => {
    if (err) res.status(500).send(err);

    res.status(200).json({
      status: 200,
      message: "Patient succesfully modified!"
    });
  });
});
// ********************************************

module.exports = router;
