// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  orderType: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL'],
    uppercase: true
  },
  priceType: {
    type: String,
    required: true,
    enum: ['MARKET', 'LIMIT'],
    uppercase: true
  },
  price: {
    type: Number,
    required: function() {
      return this.priceType === 'LIMIT';
    },
    min: 0.01
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'EXECUTED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING',
    uppercase: true
  },
  executedPrice: {
    type: Number,
    min: 0.01
  },
  executedQuantity: {
    type: Number,
    min: 0,
    default: 0
  },
  placedAt: {
    type: Date,
    default: Date.now
  },
  executedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  exchange: {
    type: String,
    default: 'NSE'
  },
  segment: {
    type: String,
    enum: ['EQUITY', 'DERIVATIVE', 'COMMODITY'],
    default: 'EQUITY'
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
orderSchema.index({ userId: 1, placedAt: -1 });
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ symbol: 1, placedAt: -1 });

// Virtual for total value
orderSchema.virtual('totalValue').get(function() {
  const price = this.executedPrice || this.price || 0;
  return price * this.quantity;
});

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return this.status === 'PENDING';
};

// Instance method to execute order
orderSchema.methods.executeOrder = function(executedPrice, executedQuantity = null) {
  this.status = 'EXECUTED';
  this.executedPrice = executedPrice;
  this.executedQuantity = executedQuantity || this.quantity;
  this.executedAt = new Date();
  return this.save();
};

// Instance method to reject order
orderSchema.methods.rejectOrder = function(reason) {
  this.status = 'REJECTED';
  this.rejectionReason = reason;
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);