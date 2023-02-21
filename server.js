const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./database/connection');
const userRoute = require('./routers/users');
const authRoute = require('./routers/auth');
const productRoute = require('./routers/products');
const cartRoute = require('./routers/carts');
const orderRoute = require('./routers/orders');
const error = require('./middleware/error');

const PORT = process.env.PORT || 8000;


// connecting database
connectDB();

app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use(error);

app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
});