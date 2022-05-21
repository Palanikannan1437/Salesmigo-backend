const express = require("express");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./User-InterActivity");

module.exports = function (io) {
  const router = express.Router();
  console.log("Socket Online");
  io.on("connection", (socket) => {
    console.log("User with socketId %s connected", socket.id);
    // io.disconnectSockets();
    socket.on("joinRoom", (data) => {
      console.log(data);
      const username = data["name"];
      const email = data["email"];
      const room = data["teamID"];
      const type = data["type"];
      const user = userJoin(socket.id, username, email, room, type);
      console.log(user);
      socket.join(user.room);
      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      socket.on("customer", (data) => {
        console.log(data);
        socket.broadcast.to(user.room).emit("customerFound", data);
      });
      // socket.on("disconnect", () => {
      //   console.log("disconnection successful");
      //   const user = userLeave(socket.id);
      //   if (user) {
      //     // Send users and room info
      //     io.to(user.room).emit("roomUsers", {
      //       room: user.room,
      //       users: getRoomUsers(user.room),
      //     });
      //   }
      // });
    });

    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
      console.log("User with socketId %s disconnected", socket.id);
    });
  });
  // io.on("connection", (socket) => {
  //   console.log("connection successfull with socket id: %s", socket.id);
  //   socket.on("joinRoom", (data) => {
  //     const username = data["name"];
  //     const email = data["email"];
  //     const photoURL = data["photoURL"];
  //     const room = data["teamID"];
  //     const type = data["type"];
  //     const user = userJoin(socket.id, username, email, photoURL, room, type);
  //     socket.join(user.room);
  //     // Send users and room info
  //     io.to(user.room).emit("roomUsers", {
  //       room: user.room,
  //       users: getRoomUsers(user.room),
  //     });

  //     socket.on("disconnect", () => {
  //       console.log("disconnection successful");
  //       const user = userLeave(socket.id);
  //       if (user) {
  //         // Send users and room info
  //         io.to(user.room).emit("roomUsers", {
  //           room: user.room,
  //           users: getRoomUsers(user.room),
  //         });
  //       }
  //     });
  //   });
  // });
  return router;
};
