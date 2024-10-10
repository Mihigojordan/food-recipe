require('dotenv').config();
const express = require('express');
const sequelize = require('./config/config');
const authRouter = require('./Routers/AdminRouter');
const recipeRoutes = require('./Routers/recipeRoutes');
const categoryRoutes = require('./Routers/categoryRoutes');
const alarmRoutes = require('./Routers/alarmRoutes');

// const alarmRoutes = require('./Routers/alarmRoutes');
const { checkAlarms } = require('./Controllers/alarmController');
const cron = require('node-cron');
const limiter = require('./Middleware/rateLimiter');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



// Apply the rate limiter to all requests

app.set('trust proxy', false);

app.use(express.urlencoded({ extended: true }));

app.use(limiter);
app.use(cors({
    origin: '*',
    credentials: true,
}));


// Use Routers
app.use('/api', authRouter);
app.use('/api', recipeRoutes);

app.use('/api', categoryRoutes);
app.use('/api', alarmRoutes);



// Test Database Connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection established');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Sync Database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Database sync error:', err);
});

// Error Handling Middleware
app.use((err, req, res, next) => {

    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // console.log(new Date().toString());

});