const Gayak = require("../models/GayakModel.js");
const User = require("../models/userModel.js");
const Notification = require("../models/notificationModel.js");
const Appointment = require("../models/appointmentModel.js");

const getallGayak = async (req, res) => {
  try {
    let docs;
    if (!req.locals) {
      docs = await Gayak.find({ isGayak: true }).populate("userId");
    } else {
      docs = await Gayak.find({ isGayak: true })
        .find({
          _id: { $ne: req.locals },
        })
        .populate("userId");
    }
    return res.send(docs);
  } catch (error) {
    console.error("Error in getallGayak:", error);
    res.status(500).send("Unable to get Gayak");
  }
};

const getnotGayak = async (req, res) => {
  try {
    const docs = await Gayak.find({ isGayak: false })
      .find({
        _id: { $ne: req.locals },
      })
      .populate("userId");
    return res.send(docs);
  } catch (error) {
    console.error("Error in getnotGayak:", error);
    res.status(500).send("Unable to get non Gayak");
  }
};

const applyforGayak = async (req, res) => {
  try {
    const alreadyFound = await Gayak.findOne({ userId: req.locals });
    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }

    const newGayak = new Gayak({ ...req.body.formDetails, userId: req.locals });
    const result = await newGayak.save();

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    console.error("Error in applyforGayak:", error);
    res.status(500).send("Unable to submit application");
  }
};

const acceptGayak = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isGayak: true, status: "accepted" },
      { new: true } // Return the updated document
    );

    await Gayak.findOneAndUpdate(
      { userId: req.body.id },
      { isGayak: true },
      { new: true } // Return the updated document
    );

    const notification = new Notification({
      userId: req.body.id,
      content: "Congratulations, Your application has been accepted.",
    });

    await notification.save();

    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    console.error("Error in acceptGayak:", error);
    res.status(500).send("Error while sending notification");
  }
};

const rejectGayak = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.body.id },
      { isGayak: false, status: "rejected" },
      { new: true } // Return the updated document
    );

    await Gayak.findOneAndDelete({ userId: req.body.id });

    const notification = new Notification({
      userId: req.body.id,
      content: "Sorry, Your application has been rejected.",
    });

    await notification.save();

    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    console.error("Error in rejectGayak:", error);
    res.status(500).send("Error while rejecting application");
  }
};

const deleteGayak = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, { isGayak: false });

    await Gayak.findOneAndDelete({ userId: req.body.userId });

    await Appointment.findOneAndDelete({ userId: req.body.userId });

    return res.send("Gayak deleted successfully");
  } catch (error) {
    console.error("Error in deleteGayak:", error);
    res.status(500).send("Unable to delete Gayak");
  }
};

module.exports = {
  getallGayak,
  getnotGayak,
  deleteGayak,
  applyforGayak,
  acceptGayak,
  rejectGayak,
};
