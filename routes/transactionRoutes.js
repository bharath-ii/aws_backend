const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// ✅ Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('GET error:', err.message);
    res.status(500).json({ msg: 'Server error' }); // ✅ fixed
  }
});

// ✅ Add transaction
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;
    if (!title || !amount || !type || !date) {
      return res.status(400).json({ msg: 'Missing fields' });
    }

    const newTxn = new Transaction({
      title,
      amount,
      type,
      category,
      date,
      user: req.user.id,
    });

    const saved = await newTxn.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST error:', err.message);
    res.status(500).json({ msg: 'Server error' }); // ✅ fixed
  }
});

// ✅ Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Transaction not found' });

    res.json(updated);
  } catch (err) {
    console.error('PUT error:', err.message);
    res.status(500).json({ msg: 'Server error' }); // ✅ fixed
  }
});

// ✅ Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ msg: 'Transaction not found' });
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE error:', err.message);
    res.status(500).json({ msg: 'Server error' }); // ✅ fixed
  }
});

module.exports = router;
