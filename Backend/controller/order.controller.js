// controllers/order.controller.js
const Order = require('../models/order');
const User = require('../models/user');

// === PLACE ORDER ===
exports.placeOrder = async (req, res) => {
  try {
    const { symbol, quantity, orderType, priceType, price } = req.body;
    const userId = req.user.id; // From JWT middleware

    // Validate order data
    if (!symbol || !quantity || !orderType || !priceType) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    if (priceType === 'LIMIT' && (!price || price <= 0)) {
      return res.status(400).json({ message: 'Valid limit price is required' });
    }

    // Create new order
    const newOrder = new Order({
      userId,
      symbol: symbol.toUpperCase(),
      quantity: parseInt(quantity),
      orderType: orderType.toUpperCase(), // BUY or SELL
      priceType: priceType.toUpperCase(), // MARKET or LIMIT
      price: priceType === 'LIMIT' ? parseFloat(price) : null,
      status: 'PENDING',
      placedAt: new Date()
    });

    await newOrder.save();

    // In a real trading system, you would:
    // 1. Check user's balance/holdings
    // 2. Validate against market hours
    // 3. Send order to exchange
    // 4. Handle order execution/rejection

    // For demo purposes, we'll simulate order processing
    setTimeout(async () => {
      try {
        const order = await Order.findById(newOrder._id);
        if (order && order.status === 'PENDING') {
          // Simulate random order execution (90% success rate)
          const isExecuted = Math.random() > 0.1;
          
          order.status = isExecuted ? 'EXECUTED' : 'REJECTED';
          order.executedAt = isExecuted ? new Date() : null;
          order.executedPrice = isExecuted ? (price || (Math.random() * 1000 + 100)) : null;
          
          await order.save();
        }
      } catch (error) {
        console.error('Order simulation error:', error);
      }
    }, 2000); // Simulate 2-second processing time

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: newOrder._id,
      order: {
        symbol: newOrder.symbol,
        quantity: newOrder.quantity,
        orderType: newOrder.orderType,
        priceType: newOrder.priceType,
        price: newOrder.price,
        status: newOrder.status
      }
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

// === GET USER ORDERS ===
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 20, page = 1 } = req.query;

    const filter = { userId };
    if (status) {
      filter.status = status.toUpperCase();
    }

    const orders = await Order.find(filter)
      .sort({ placedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders,
        hasMore: totalOrders > parseInt(page) * parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// === GET ORDER BY ID ===
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// === CANCEL ORDER ===
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'CANCELLED';
    order.cancelledAt = new Date();
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order: {
        id: order._id,
        status: order.status,
        cancelledAt: order.cancelledAt
      }
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

// === GET ORDER HISTORY SUMMARY ===
exports.getOrderSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const summary = await Order.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const formattedSummary = {
      total: 0,
      executed: 0,
      pending: 0,
      cancelled: 0,
      rejected: 0
    };

    summary.forEach(item => {
      const status = item._id.toLowerCase();
      formattedSummary[status] = item.count;
      formattedSummary.total += item.count;
    });

    // Get recent orders
    const recentOrders = await Order.find({ userId })
      .sort({ placedAt: -1 })
      .limit(5)
      .select('symbol quantity orderType status placedAt executedPrice');

    res.json({
      summary: formattedSummary,
      recentOrders
    });

  } catch (error) {
    console.error('Error fetching order summary:', error);
    res.status(500).json({ message: 'Failed to fetch order summary' });
  }
};