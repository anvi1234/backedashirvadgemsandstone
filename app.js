const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/carts', require('./routes/cart.routes'));
app.use('/api/astro', require('./routes/astro.routes'));
app.use('/api/ship', require('./routes/shipment.route'));


module.exports = app;
