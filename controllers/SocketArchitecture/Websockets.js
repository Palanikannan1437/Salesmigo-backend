const express = require("express");
const socketController = require("./User-InterActivity");

module.exports = function (io) {
  const router = express.Router();
  console.log("Socket Online");

  //user connects
  io.on("connection", (socket) => {
    console.log("User with socketId %s connected", socket.id);
    // io.disconnectSockets();
    socket.on("joinRoom", (data) => {
      // console.log(data);
      const username = data["name"];
      const email = data["email"];
      const room = data["teamID"];
      const type = data["type"];
      const photoUrl = data["photoUrl"];
      const status = "Available";
      const user = socketController.userJoin(
        socket.id,
        username,
        email,
        room,
        type,
        photoUrl,
        status
      );
      // console.log(user);
      socket.join(user.room);

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: socketController.getRoomUsers(user.room),
      });

      socket.on("customer", (data) => {
        const customers = socketController.customerJoin(data);
        socket.broadcast.to(user.room).emit("customerFound", customers);
      });

      socket.on("AllocationOfCustomer", (data) => {
        console.log("allocation of customer", data);
        if (Object.keys(data).length !== 0) {
          socketController.AllocateCustomer(data);
          socket.broadcast.to(user.room).emit("roomUsers", {
            room: user.room,
            users: socketController.getRoomUsers(user.room),
          });
          io.to(data.worker.id).emit("customerToWorker", data.customer);
        }
      });

      socket.on("workerFree", (data) => {
        // console.log(socketController.getCustomersAllotedToWorker(data));
        io.to(socket.id).emit(
          "customersOfWorker",
          socketController.getCustomersAllotedToWorker(socket.id)
        );
      });

      socket.on("customerCatered", (data) => {
        console.log("yooooooooooo");
        socketController.customerCatered(data.customerUsername, socket.id);
        io.to(socket.id).emit(
          "customersOfWorker",
          socketController.getCustomersAllotedToWorker(socket.id)
        );
      });
    });

    socket.on("disconnect", () => {
      const user = socketController.userLeave(socket.id);
      if (user) {
        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: socketController.getRoomUsers(user.room),
        });
      }
      console.log("User with socketId %s disconnected", socket.id);
    });
  });
  return router;
};
