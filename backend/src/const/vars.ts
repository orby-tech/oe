export const vars = {
  mongo: {
    url: process.env.MONGO_URL || "localhost:27017",
  },
  env: process.env.MODE,
};
