import express from 'express';
import Query from '../models/Query.js';
import { NLPService } from '../services/nlpService.js';
import { io } from '../server.js';
import { EmailService } from '../services/emailService.js';


const router = express.Router();

// Get all queries with filters
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, assignedTo, source } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (source) filter.source = source;

    const queries = await Query.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new query
router.post('/', async (req, res) => {
  try {
    const { source, customerName, customerEmail, subject, message } = req.body;

    // Auto-categorize and prioritize using NLP
    const category = NLPService.categorizeMessage(message);
    const priority = NLPService.detectPriority(message, category);
    const tags = NLPService.extractTags(message);

    const query = new Query({
      source,
      customerName,
      customerEmail,
      subject,
      message,
      category,
      priority,
      tags
    });

    const savedQuery = await query.save();
    
    // send auto-resonse email
    await EmailService.sendAutoResponse(savedQuery);
    // Emit real-time update
    io.emit('newQuery', savedQuery);

    res.status(201).json(savedQuery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update query (assign, change status, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { status, assignedTo, priority } = req.body;
    
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, priority },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // Emit real-time update
    io.emit('queryUpdated', query);

    res.json(query);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get analytics
router.get('/analytics/summary', async (req, res) => {
  try {
    const totalQueries = await Query.countDocuments();
    const newQueries = await Query.countDocuments({ status: 'new' });
    const resolvedQueries = await Query.countDocuments({ status: 'resolved' });
    
    const priorityDistribution = await Query.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const categoryDistribution = await Query.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } }
    }]);

    const sourceDistribution = await Query.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } }
    }]);

    const avgResponseTime = await Query.aggregate([
      { $match: { responseTime: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$responseTime' } } }
    ]);

    res.json({
      totalQueries,
      newQueries,
      resolvedQueries,
      priorityDistribution,
      categoryDistribution,
      sourceDistribution,
      avgResponseTime: avgResponseTime[0]?.avg || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;