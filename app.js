require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");
const deliveryRouter = require("./api/deliveries/delivery.router");
const ordersRouter = require("./api/orders/order.router");
const paymentRouter = require("./api/payment/payment.router");
const payRouter = require("./api/pay/payRouter");

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/deliveries", deliveryRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/pay", payRouter);

app.listen(process.env.APP_PORT, () => {
  console.log("Server started at port 3000");
});
