const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 5000 },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
      index: true,
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueAt: { type: Date, default: null },
    tags: { type: [String], default: [] },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, status: 1, createdAt: -1 });

taskSchema.pre('save', function setCompletedAt(next) {
  if (this.isModified('status')) {
    this.completedAt = this.status === 'done' ? new Date() : null;
  }
  next();
});

taskSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Task', taskSchema);
