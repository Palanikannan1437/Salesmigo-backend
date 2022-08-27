let users = [];
let customers = [];

exports.userJoin = (id, username, email, room, type, photoUrl, status) => {
  const customersCatering = [];
  const user = {
    id,
    username,
    room,
    email,
    type,
    photoUrl,
    status,
    customersCatering,
  };
  //for limiting the number of socket connections each user can make
  // users = users.filter(oneUser=>oneUser.email !== email)
  users.push(user);
  return user;
};

exports.customerJoin = (username) => {
  const customer = { username };
  // if (
  //   customers.filter((customer) => customer.username === username).length === 0
  // ) {
  // }
  customers.push(customer);
  return customers;
};

exports.getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

exports.userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

exports.getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

exports.AllocateCustomer = (data) => {
  if (data.worker && data.worker.id) {
    users.forEach((user) => {
      if (user.id === data.worker.id) {
        // console.log(user.id);
        user.status = "Occupied";
        user.customersCatering.push(data.customer);
        console.log("customer cater", user.customersCatering[0]);
      }
    });
    const index = customers.findIndex(
      (customer) =>
        customer.username.split(" ")[1] === data.customer.username.split(" ")[1]
    );

    if (index !== -1) {
      customers.splice(index, 1)[0];
    }
  }
};

exports.getCustomersAllotedToWorker = (workerId) => {
  const foundCustomers = users
    .filter((user) => {
      return user.id === workerId;
    })
    .map((foundUser) => foundUser.customersCatering);
  return foundCustomers;
};

exports.customerCatered = (customerUsername, workerId) => {
  users.forEach((user) => {
    if (user.id === workerId && user.customersCatering) {
      user.customersCatering = user.customersCatering.filter(
        (customerAllocated) => {
          console.log(
            customerAllocated.username.split("_")[1],
            customerUsername
          );
          return customerAllocated.username.split("_")[1] !== customerUsername;
        }
      );
    }
  });
};
