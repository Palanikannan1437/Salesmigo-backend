const express = require("express");
const socketController = require("./User-InterActivity");

module.exports = function (io) {
  const router = express.Router();
  console.log("Socket Online");
  //user connects
  io.on("connection", (socket) => {
    console.log("User with socketId %s connected", socket.id);
    //inorder to disconnect all existing socket connections,de-comment the below code👇
    // io.disconnectSockets();

    //user joins the room
    socket.on("joinRoom", (data) => {
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
      socket.join(user.room);

      // On joining the room, we send current users and room info to the
      // user that just joined
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: socketController.getRoomUsers(user.room),
      });

      // Detected customer gets connected to the room
      socket.on("customer", (data) => {
        const customers = socketController.customerJoin(data);
        socket.broadcast.to(user.room).emit("customerFound", customers);
      });

      //when a customer is allocated to a worker we remove that customer from the list
      //of customers and send the customer data to the worker
      socket.on("AllocationOfCustomer", (data) => {
        if (Object.keys(data).length !== 0) {
          socketController.AllocateCustomer(data);
          socket.broadcast.to(user.room).emit("roomUsers", {
            room: user.room,
            users: socketController.getRoomUsers(user.room),
          });
          io.to(data.worker.id).emit("customerToWorker", data.customer);
        }
      });

      //when the worker finishes catering a customer
      socket.on("workerFree", (data) => {
        io.to(socket.id).emit(
          "customersOfWorker",
          socketController.getCustomersAllotedToWorker(socket.id)
        );
      });

      //when the worker finishes catering a customer on clicking "customer catered" on the frontend
      socket.on("customerCatered", (data) => {
        socketController.customerCatered(data.customerUsername, socket.id);
        io.to(socket.id).emit(
          "customersOfWorker",
          socketController.getCustomersAllotedToWorker(socket.id)
        );
      });
    });

    //when any user diconnects from the socket
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
