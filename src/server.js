const express = require('express');
const app = express();
const sequelize = require('./config/database');
require('dotenv').config();

app.use(express.json());

//CRUD routes
app.use('/parent', require('./routes/routes.js'));

//error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

// Test DB connection and sync models
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    await sequelize.sync({alter: true}); // or { force: true } for dev reset
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();

//test route
app.get('/', (req, res, next) => {
  res.send('Hello World');
});
