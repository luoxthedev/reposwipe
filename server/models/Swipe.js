const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    repoId: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        enum: ['like', 'reject', 'super'],
        required: true
    },
    repoData: {
        name: String,
        owner: String,
        description: String,
        stars: Number,
        language: String,
        url: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index composé pour éviter les doublons
swipeSchema.index({ userId: 1, repoId: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
