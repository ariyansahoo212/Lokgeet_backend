const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

const getallappointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { userId: req.query.search },
            { GayakId: req.query.search },
          ],
        }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("GayakId")
      .populate("userId");
    return res.send(appointments);
  } catch (error) {
    res.status(500).send("Unable to get LokGeet");
  }
};

const getbookedappoinments = async (req, res) => {
  const { GayakId } = req.body;
  try {
    const bookedLokGeet = await Appointment.find(GayakId);
    console.log("The booked details are - ",bookedLokGeet);
    return res.status(200).json({ LokGeet: bookedLokGeet });
  } catch (error) {
    res.status(500).send("Unable to book LokGeet");
  }
};

const bookappointment = async (req, res) => {
  try {
    //to check if Gayak already have LokGeet on particuler data
    const alreadyLokGeet = await Appointment.findOne({
      date: req.body.date,
      GayakId: req.body.GayakId,
    });

    if (alreadyLokGeet?.status == "Pending") {
      // console.log(alreadyLokGeet);
      return res.status(409).json({ msg: "Appointment already exists" });
    }

    const appointment = await Appointment({
      date: req.body.date,
      time: req.body.time,
      GayakId: req.body.GayakId,
      userId: req.locals,
    });

    const usernotification = Notification({
      userId: req.locals,
      content: `You booked an LokGeet with ${req.body.Gayakname} for ${req.body.date} ${req.body.time}`,
    });

    await usernotification.save();

    const user = await User.findById(req.locals);

    const Gayaknotification = Notification({
      userId: req.body.GayakId,
      content: `You have an LokGeet with ${user.firstname} ${user.lastname} on ${req.body.date} at ${req.body.time}`,
    });

    await Gayaknotification.save();

    const result = await appointment.save();
    return res.status(201).send(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to book LokGeet");
  }
};

const completed = async (req, res) => {
  try {
    const alreadyFound = await Appointment.findOneAndUpdate(
      { _id: req.body.appointid },
      { status: "Completed" }
    );

    const usernotification = Notification({
      userId: req.locals,
      content: `Your LokGeet with ${req.body.Gayakname} has been completed`,
    });

    await usernotification.save();

    const user = await User.findById(req.locals);

    const Gayaknotification = Notification({
      userId: req.body.GayakId,
      content: `Your LokGeet with ${user.firstname} ${user.lastname} has been completed`,
    });

    await Gayaknotification.save();

    return res.status(201).send("LokGeet completed");
  } catch (error) {
    res.status(500).send("Unable to mark complete LokGeet");
  }
};

module.exports = {
  getallappointments,
  bookappointment,
  completed,
  getbookedappoinments,
};
