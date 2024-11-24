// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// App Initialization
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Schemas and Models
const customerSchema = new mongoose.Schema({
  fullName: String,
  occupation: String,
  age: Number,
  aadharCardNumber: String,
  numberOfOccupants: Number,
  address: String,
  roomNumber: String,
  checkInDate: Date,
  checkOutDate: Date,
  price: Number,
  timestamp: { type: Date, default: Date.now },
});

const roomSchema = new mongoose.Schema({
  roomNumber: String,
  isAvailable: { type: Boolean, default: true },
});

const Customer = mongoose.model("Customer", customerSchema);
const Room = mongoose.model("Room", roomSchema);

// API Routes

// Add Customer
app.post("/api/customers", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();

    // Update room availability
    await Room.updateOne(
      { roomNumber: req.body.roomNumber },
      { isAvailable: false }
    );

    res.status(201).send({ message: "Customer added successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Error adding customer.", error: err });
  }
});

// Fetch Admin Dashboard Data
app.get("/api/admin/insights", async (req, res) => {
  try {
    const { filter } = req.query;
    let filterDate = new Date();

    if (filter === "day") filterDate.setDate(filterDate.getDate() - 1);
    else if (filter === "week") filterDate.setDate(filterDate.getDate() - 7);
    else if (filter === "month") filterDate.setMonth(filterDate.getMonth() - 1);
    else if (filter === "year")
      filterDate.setFullYear(filterDate.getFullYear() - 1);

    const customers = await Customer.find({ timestamp: { $gte: filterDate } });
    const totalIncome = customers.reduce(
      (acc, customer) => acc + customer.price,
      0
    );

    const rooms = await Room.find();
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((room) => room.isAvailable).length;

    res.send({
      totalRooms,
      availableRooms,
      checkInCount: customers.filter(
        (c) => new Date(c.checkInDate) >= filterDate
      ).length,
      checkOutCount: customers.filter(
        (c) => new Date(c.checkOutDate) >= filterDate
      ).length,
      totalIncome,
    });
  } catch (err) {
    res.status(500).send({ message: "Error fetching insights.", error: err });
  }
});

// Fetch Available Rooms
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true });
    res.send(rooms);
  } catch (err) {
    res.status(500).send({ message: "Error fetching rooms.", error: err });
  }
});

// Frontend Deployment
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
