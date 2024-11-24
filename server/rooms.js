// Import required modules
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Room schema and model
const roomSchema = new mongoose.Schema({
  roomNumber: String,
  isAvailable: { type: Boolean, default: true },
});

const Room = mongoose.model('Room', roomSchema);

// Seed function to populate rooms
async function seedRooms() {
  try {
    const rooms = [];

    // Generate room numbers for floor 101-119 (excluding 111)
    for (let i = 101; i <= 119; i++) {
      if (i !== 111) {
        rooms.push({ roomNumber: i.toString(), isAvailable: true });
      }
    }

    // Generate room numbers for floor 201-226 (excluding 216)
    for (let i = 201; i <= 226; i++) {
      if (i !== 216) {
        rooms.push({ roomNumber: i.toString(), isAvailable: true });
      }
    }

    // Generate room numbers for floor 301-326
    for (let i = 301; i <= 326; i++) {
      rooms.push({ roomNumber: i.toString(), isAvailable: true });
    }

    // Clear existing rooms and seed new ones
    await Room.deleteMany({});
    await Room.insertMany(rooms);

    console.log('Rooms have been seeded successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding rooms:', error);
    mongoose.connection.close();
  }
}

// Call the seed function
seedRooms();