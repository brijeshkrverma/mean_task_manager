const express = require('express');
const { z } = require('zod');
const Task = require('../models/task.model');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { ApiError } = require('../middleware/error');
const { enqueue } = require('../lib/queue');
const { logger } = require('../lib/logger');

const router = express.Router();

router.use(requireAuth);

const statusEnum = z.enum(['todo', 'in_progress', 'done']);
const priorityEnum = z.enum(['low', 'medium', 'high']);

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  dueAt: z.coerce.date().nullish(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
});

const updateSchema = createSchema.partial();

const listSchema = z.object({
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  q: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Queueing is best-effort: a failed side-effect must not fail the request.
async function publish(event, payload) {
  try {
    await enqueue(event, payload);
  } catch (err) {
    logger.warn({ err, event }, 'failed to enqueue task event');
  }
}

router.get('/', validate(listSchema, 'query'), async (req, res, next) => {
  try {
    const { status, priority, q, page, limit } = req.query;

    const filter = { owner: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) filter.title = { $regex: q, $options: 'i' };

    const [items, total] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createSchema), async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user.id });
    await publish('task.created', { taskId: String(task._id), owner: req.user.id });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) throw new ApiError(404, 'Task not found');
    res.json({ task });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate(updateSchema), async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) throw new ApiError(404, 'Task not found');

    Object.assign(task, req.body);
    await task.save();

    await publish('task.updated', { taskId: String(task._id), owner: req.user.id });
    res.json({ task });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) throw new ApiError(404, 'Task not found');

    await publish('task.deleted', { taskId: String(task._id), owner: req.user.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
