const api = require('lambda-api')();
const routes = require('./routes');

routes.forEach(route => {
  api[route.method](route.path, route.handler);
});

exports.handler = async (event, context) => {
  // Run the API router
  return await api.run(event, context);
};
