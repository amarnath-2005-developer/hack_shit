const mongoose = require('mongoose');
const { AI_INSIGHT_TYPES } = require('../utils/constants');

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: AI_INSIGHT_TYPES,
        message: '{VALUE} is not a valid insight type',
      },
      required: [true, 'Insight type is required'],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Insight content is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user and type
aiInsightSchema.index({ userId: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('AIInsight', aiInsightSchema);
