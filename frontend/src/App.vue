<template>
  <div>
    <!-- Navigation -->
    <header class="header">
      <div class="header-container">
        <h1 class="header-title">Ranjit Residency</h1>
        <!-- Tab Selection -->
        <div class="tab-buttons">
          <button
            :class="{'active': activeTab === 'receptionist', 'inactive': activeTab !== 'receptionist'}"
            @click="activeTab = 'receptionist'"
          >
            Receptionist View
          </button>
          <button
            :class="{'active': activeTab === 'admin', 'inactive': activeTab !== 'admin'}"
            @click="activeTab = 'admin'"
          >
            Admin View
          </button>
        </div>
      </div>
    </header>

    <!-- Receptionist View -->
    <div v-if="activeTab === 'receptionist'">
      <form @submit.prevent="submitCustomer" class="form-container">
        <h2>Add Customer</h2>

        <div class="form-grid">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="customer.fullName" type="text" required />
          </div>

          <div class="form-group">
            <label>Occupation</label>
            <input v-model="customer.occupation" type="text" required />
          </div>

          <div class="form-group">
            <label>Age</label>
            <input v-model="customer.age" type="number" required />
          </div>

          <div class="form-group">
            <label>Aadhar Card Number</label>
            <input v-model="customer.aadharCardNumber" type="text" required />
          </div>

          <div class="form-group">
            <label>Number of Occupants</label>
            <input v-model="customer.numberOfOccupants" type="number" required />
          </div>

          <div class="form-group address">
            <label>Address</label>
            <textarea v-model="customer.address" required></textarea>
          </div>

          <div class="form-group">
            <label>Room</label>
            <select v-model="customer.roomNumber" required>
              <option value="" disabled>Select a Room</option>
              <option v-for="room in rooms" :key="room.roomNumber" :value="room.roomNumber">
                Room {{ room.roomNumber }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Check-in Date</label>
            <input v-model="customer.checkInDate" type="date" required />
          </div>

          <div class="form-group">
            <label>Check-out Date</label>
            <input v-model="customer.checkOutDate" type="date" required />
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>

    <!-- Admin View -->
    <div v-if="activeTab === 'admin'" class="dashboard">
      <h2>Admin Dashboard</h2>

      <div class="filters">
        <label>Filter:</label>
        <select v-model="filter" @change="fetchInsights">
          <option value="day">Last Day</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div class="insight-cards">
        <div class="insight-card">
          <h3>Total Rooms</h3>
          <p class="value">{{ insights.totalRooms }}</p>
        </div>

        <div class="insight-card">
          <h3>Available Rooms</h3>
          <p class="value">{{ insights.availableRooms }}</p>
        </div>

        <div class="insight-card">
          <h3>Check-ins in Period</h3>
          <p class="value">{{ insights.checkInCount }}</p>
        </div>

        <div class="insight-card">
          <h3>Check-outs in Period</h3>
          <p class="value">{{ insights.checkOutCount }}</p>
        </div>

        <div class="insight-card">
          <h3>Total Income</h3>
          <p class="value">₹{{ insights.totalIncome }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import './assets/styles.css';

export default {
  data() {
    return {
      activeTab: 'receptionist',
      customer: {
        fullName: '',
        occupation: '',
        age: null,
        aadharCardNumber: '',
        numberOfOccupants: null,
        address: '',
        roomNumber: '',
        checkInDate: '',
        checkOutDate: '',
        price: null,
      },
      rooms: [],
      filter: 'day',
      insights: {},
    };
  },
  methods: {
    async fetchRooms() {
      try {
        const response = await axios.get('/api/rooms');
        this.rooms = response.data;
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    },
    async fetchInsights() {
      try {
        const response = await axios.get('/api/admin/insights', {
          params: { filter: this.filter },
        });
        this.insights = response.data;
      } catch (err) {
        console.error('Error fetching insights:', err);
      }
    },
    async submitCustomer() {
      try {
        await axios.post('/api/customers', this.customer);
        alert('Customer added successfully!');
        this.fetchRooms();
        this.customer = {
          fullName: '',
          occupation: '',
          age: null,
          aadharCardNumber: '',
          numberOfOccupants: null,
          address: '',
          roomNumber: '',
          checkInDate: '',
          checkOutDate: '',
          price: null,
        };
      } catch (err) {
        console.error('Error adding customer:', err);
      }
    },
  },
  mounted() {
    this.fetchRooms();
    this.fetchInsights();
  },
};
</script>
