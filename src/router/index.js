const api = require('lambda-api')();
const routes = require('./routes');

// Load routes
routes.forEach(route => {
  api[route.method](route.path, route.handler);
});

// Lambda handler
exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  try {
    const result = await api.run(event, context);
    console.log('Response:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error handling request:', error);
    throw error;
  }
};
