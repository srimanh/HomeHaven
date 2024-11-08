const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// MongoDB Schema for Room Design
const RoomDesignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomType: {
    type: String,
    required: true,
    enum: ['living', 'bedroom', 'dining', 'office']
  },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  style: {
    type: String,
    required: true
  },
  colorScheme: [{
    type: String
  }],
  furniture: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Furniture'
  }],
  budget: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

const RoomDesign = mongoose.model('RoomDesign', RoomDesignSchema);

// Validation middleware
const validateRoomDesign = (req, res, next) => {
  const { roomType, dimensions, style, colorScheme } = req.body;

  if (!roomType || !dimensions || !style || !colorScheme) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { length, width, height } = dimensions;
  if (!length || !width || !height) {
    return res.status(400).json({ error: 'Invalid dimensions' });
  }

  next();
};

// Create new room design
router.post('/customize', auth, validateRoomDesign, async (req, res) => {
  try {
    const { roomType, dimensions, style, colorScheme, budget, furniture } = req.body;

    const roomDesign = new RoomDesign({
      userId: req.user._id,
      roomType,
      dimensions,
      style,
      colorScheme,
      budget,
      furniture
    });

    await roomDesign.save();
    res.status(201).json(roomDesign);
  } catch (error) {
    res.status(500).json({ error: 'Error creating room design' });
  }
});

// Get furniture recommendations based on room design
router.post('/recommendations', auth, async (req, res) => {
  try {
    const { roomType, dimensions, style, colorScheme, budget } = req.body;

    // Calculate room area
    const roomArea = dimensions.length * dimensions.width;

    // Query furniture collection based on criteria
    const recommendations = await Furniture.find({
      roomType: roomType,
      style: style,
      price: { $lte: budget || Infinity },
      dimensions: {
        $elemMatch: {
          length: { $lte: dimensions.length },
          width: { $lte: dimensions.width }
        }
      }
    }).limit(10);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recommendations' });
  }
});

// Save room design
router.post('/designs/save', auth, async (req, res) => {
  try {
    const design = await RoomDesign.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, lastModified: Date.now() },
      { new: true, upsert: true }
    );
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: 'Error saving design' });
  }
});

// Get saved designs
router.get('/designs', auth, async (req, res) => {
  try {
    const designs = await RoomDesign.find({ userId: req.user._id })
      .sort({ lastModified: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching designs' });
  }
});

// Delete saved design
router.delete('/designs/:id', auth, async (req, res) => {
  try {
    await RoomDesign.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting design' });
  }
});

module.exports = router;