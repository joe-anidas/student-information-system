const express = require('express');
const { ObjectId } = require('mongodb');
const client = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await client.connect();
    const marks = await client.db("sis").collection("marks").find().toArray();
    res.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Error fetching marks', error });
  } finally {
    await client.close();
  }
});

router.post('/', async (req, res) => {
  try {
    await client.connect();
    const newMarks = req.body;
    await client.db("sis").collection("marks").insertOne(newMarks);
    res.json(newMarks);
  } catch (error) {
    console.error('Error adding marks:', error);
    res.status(500).json({ message: 'Error adding marks', error });
  } finally {
    await client.close();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const marksId = req.params.id;
    await client.db("sis").collection("marks").deleteOne({ _id: new ObjectId(marksId) });
    res.json({ message: 'Marks deleted' });
  } catch (error) {
    console.error('Error deleting marks:', error);
    res.status(500).json({ message: 'Error deleting marks', error });
  } finally {
    await client.close();
  }
});

module.exports = router;