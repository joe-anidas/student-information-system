const express = require('express');
const { ObjectId } = require('mongodb');
const client = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await client.connect();
    const courses = await client.db("sis").collection("courses").find().toArray();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error });
  } finally {
    await client.close();
  }
});

router.post('/', async (req, res) => {
  try {
    await client.connect();
    const newCourse = req.body;
    await client.db("sis").collection("courses").insertOne(newCourse);
    res.json(newCourse);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Error adding course', error });
  } finally {
    await client.close();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const courseId = req.params.id;
    await client.db("sis").collection("courses").deleteOne({ _id: new ObjectId(courseId) });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course', error });
  } finally {
    await client.close();
  }
});

module.exports = router;