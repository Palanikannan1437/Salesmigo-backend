module.exports = (key, cb, redisClient) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) return reject(error);
      if (data != null) return resolve(JSON.parse(data));
      const freshData = await cb();
      redisClient.setex(key, 3600, JSON.stringify(freshData));
      resolve(freshData);
    });
  });
};
