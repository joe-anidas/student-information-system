const express = require('express');
const { ObjectId } = require('mongodb');
const client = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await client.connect();
    const students = await client.db("sis").collection("students").find().toArray();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  } finally {
    await client.close();
  }
});

router.post('/', async (req, res) => {
  try {
    await client.connect();
    const newStudent = req.body;
    await client.db("sis").collection("students").insertOne(newStudent);
    res.json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Error adding student', error });
  } finally {
    await client.close();
  }
});

router.put('/:id', async (req, res) => {
  try {
    await client.connect();
    const studentId = req.params.id;
    const updatedStudent = req.body;
    await client.db("sis").collection("students").updateOne({ _id: new ObjectId(studentId) }, { $set: updatedStudent });
    res.json({ message: 'Student updated' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error });
  } finally {
    await client.close();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const studentId = req.params.id;
    await client.db("sis").collection("students").deleteOne({ _id: new ObjectId(studentId) });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error });
  } finally {
    await client.close();
  }
});

module.exports = router;