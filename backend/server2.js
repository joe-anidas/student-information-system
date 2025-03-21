
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = "mongodb+srv://joe:joe@joe.wv0k6.mongodb.net/?retryWrites=true&w=majority&appName=JOE";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// API Endpoints for Students
app.get('/students', async (req, res) => {
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

app.post('/students', async (req, res) => {
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

app.put('/students/:id', async (req, res) => {
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

app.delete('/students/:id', async (req, res) => {
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

// API Endpoints for Faculty
app.get('/faculty', async (req, res) => {
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

app.post('/faculty', async (req, res) => {
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

app.delete('/faculty/:id', async (req, res) => {
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

// API Endpoints for Courses
app.get('/courses', async (req, res) => {
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

app.post('/courses', async (req, res) => {
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

app.delete('/courses/:id', async (req, res) => {
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

// API Endpoints for Marks
app.get('/marks', async (req, res) => {
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

app.post('/marks', async (req, res) => {
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

app.delete('/marks/:id', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});