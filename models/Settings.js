const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    settingId: { type: String, default: 'global' },
    reminderHour: { type: Number, default: 9 },
    reminderMinute: { type: Number, default: 0 }
});

module.exports = mongoose.model('Settings', settingsSchema);