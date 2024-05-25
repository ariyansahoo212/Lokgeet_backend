const express = require("express");
const GayakController = require("../controllers/GayakController");
const auth = require("../middleware/auth");

const GayakRouter = express.Router();

GayakRouter.get("/getallGayak", GayakController.getallGayak);

GayakRouter.get("/getnotGayak", auth, GayakController.getnotGayak);

GayakRouter.post("/applyforGayak", auth, GayakController.applyforGayak);

GayakRouter.put("/deleteGayak", auth, GayakController.deleteGayak);

GayakRouter.put("/acceptGayak", auth, GayakController.acceptGayak);

GayakRouter.put("/rejectGayak", auth, GayakController.rejectGayak);

module.exports = GayakRouter;
