const express = require('express');
const { ObjectId } = require('mongodb');
const client = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await client.connect();
    const faculty = await client.db("sis").collection("faculty").find().toArray();
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Error fetching faculty', error });
  } finally {
    await client.close();
  }
});

router.post('/', async (req, res) => {
  try {
    await client.connect();
    const newFaculty = req.body;
    await client.db("sis").collection("faculty").insertOne(newFaculty);
    res.json(newFaculty);
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Error adding faculty', error });
  } finally {
    await client.close();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const facultyId = req.params.id;
    await client.db("sis").collection("faculty").deleteOne({ _id: new ObjectId(facultyId) });
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ message: 'Error deleting faculty', error });
  } finally {
    await client.close();
  }
});

module.exports = router;