import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
     type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
