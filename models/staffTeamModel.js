const mongoose = require("mongoose");

const StaffTeamSchema = mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Enter manager id!"],
    ref: "employees",
  },

  workers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
});

const StaffTeam = mongoose.model("StaffTeam", StaffTeamSchema);

module.exports = StaffTeam;
