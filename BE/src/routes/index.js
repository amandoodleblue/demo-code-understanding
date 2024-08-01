const { USER_TYPE } = require('./../constants')
const initializeRoutes = (app) => {
  app.use("/api/v1/user", require("./v1/user.routes"));
};

module.exports = initializeRoutes;
