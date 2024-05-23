const loginHandler = require('../../api/user/login');
const signUpHandler = require('../../api/user/signUp');
const getUserDataHandler = require('../../api/user/getUserData');
const verifyTokenHandler = require('../../api/user/verifyToken');

const routes = [
  // User routes
  {
    path: "/login",
    method: "post",
    handler: loginHandler,
  },
  {
    path: "/signup",
    method: "post",
    handler: signUpHandler,
  },
  {
    path: "/user",
    method: "get",
    handler: getUserDataHandler,
  },
  {
    path: "/verify-token",
    method: "post",
    handler: verifyTokenHandler,
  },
  // Conversation routes
];

module.exports = routes;
