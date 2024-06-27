
const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8000;

// Enable CORS
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use((req, res, next) => {
  res.removeHeader('Permissions-Policy');
  next();
});


app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  next();
});

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task1_meeting_platform',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create the uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//USER  API


// Endpoint to create an event
app.post('/create_event', upload.array('eventPhotos'), (req, res) => {
  const { hostname, eventName, date,enddate, time, certified, freeOrPaid,description, longDescription, limitOfPeople, techStack } = req.body;
  const eventPhotos = req.files.map(file => file.filename);

  const query = `INSERT INTO createevent (hostname, eventname, date,enddate, time, certified, freeorpaid, photo, description, longdescription, limitofpeople, techstack)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [hostname, eventName, date,enddate, time, certified, freeOrPaid, eventPhotos.join(','), description, longDescription, limitOfPeople, techStack], (err, result) => {
    if (err) {
      console.error('Error inserting event data:', err);
      return res.status(500).send('Error creating event Server Side');
    }
    res.status(200).send('Event created successfully');
  });
});

// Endpoint to Fetch all events used for dashboard
app.get('/data', (req, res) => {
  const query = `SELECT * FROM createevent`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send({ message: 'Error fetching data' });
    } else {
      res.json(results);
      console.log("DAta is:",results);
    }
  });
});

//endpoint to fetch all events on events_list page
app.get('/events_list', (req, res) => {
  const query = 'SELECT * FROM createevent';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      // Convert BLOB to base64 string
      results = results.map(event => {
        if (event.photo) {
          event.photo = event.photo.toString('base64');
        }
        return event;
      });
      res.json(results);
      console.log(results);
    }
  });
});
// Endpoint to fetch all events

app.get('/certificate_data', (req, res) => {
  const query = "SELECT * FROM createevent WHERE certified='true'";
  console.log("Query Result is", query);
  
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      results = results.map(event => {
        if (event.photo) {
          event.photo = event.photo.toString('base64');
        }
        return event;
      });
      console.log(results);
      res.json(results);
    }
  });
});

// Endpoint to fetch filtered events
app.post('/filter_events', (req, res) => {
  const { startDate, endDate, courseType, certification } = req.body;
  let query = 'SELECT * FROM createevent WHERE 1=1';
  let queryParams = [];

  if (startDate) {
    query += ' AND date >= ?';
    queryParams.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    queryParams.push(endDate);
  }
  if (courseType) {
    query += ' AND freeorpaid = ?';
    queryParams.push(courseType);
  }
  if (certification) {
    query += ' AND certified = ?';
    queryParams.push(certification === 'yes' ? 1 : 0);
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      results = results.map(event => {
        if (event.photo) {
          event.photo = event.photo.toString('base64');
        }
        return event;
      });
      res.json(results);
    }
  });
});

app.post('/login', (req, res) => {

  const { name, contact, username, password } = req.body;
  const query = 'INSERT INTO users (name, contact, username, password) VALUES (?, ?, ?, ?)';
  db.query(query, [name,contact,username, password], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).send('Server error');
      return;
    }
    //res.status(200).send('User registered successfully');
    console.log("Login SuccessFull");

  });
});

//ADMIN API

app.post('/Admin_Login', (req, res) => {
  console.log('Received POST request at /Admin_Login');
  const { username, password } = req.body;
  console.log('Received data:', { username, password });
  
  const query = 'INSERT INTO admin (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
      if (err) {
          console.error('Error inserting data into the database:', err);
          res.status(500).send('Server error');
          return;
      }
      console.log('Login Successful:', result);
      res.status(200).send('Admin registered successfully');
  });
});


// Register Event Endpoint
app.post('/registerEvent', (req, res) => {
  const { eventid, eventname ,hostname, description, techstack, startdate, enddate, payment} = req.body;
  const userId = req.user.id;
  const username=req.user.username;

  const query = 'INSERT INTO event_registrations (userid, username, eventid, eventname, hostname, description, techstack, startdate, enddate, payment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ?)';
  db.query(query, [userId, username, eventid, eventname, hostname, description, techstack, startdate, enddate, payment], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error registering event' });
    }
    res.status(200).json({ message: 'Event registered successfully' });

  });
});


// Endpoint for Events history 
// app.get('/EventsHistory', (req, res) => {
//   const currentUserId = req.user.usernameid;  // Assuming req.user contains the current user's information
//   const currentUsername = req.user.username;  // Assuming req.user contains the current user's information

//   const query = `SELECT * FROM event_registrations WHERE userid = ? AND username = ?`;
//   db.query(query, [currentUserId, currentUsername], (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       res.status(500).send({ message: 'Error fetching data' });
//     } else {
//       res.json(results);
//       console.log("Events History for user:", results);
//     }
//   });
// });

app.post('/EventsHistory', (req, res) => {
  const { userid, username } = req.body;

  // Validate user in the database
  const userQuery = 'SELECT * FROM users WHERE id = ? AND username = ?';
  db.query(userQuery, [userid, username], (userError, userResults) => {
    if (userError) {
      console.error('Error fetching user data:', userError);
      return res.status(500).json({ error: 'Server error' });
    }

    if (userResults.length === 0) {
      return res.status(400).json({ error: 'User not found or invalid credentials' });
    }

    // Fetch events joined by the user
    const eventsQuery = 'SELECT * FROM event_registrations WHERE userid = ? AND username = ?';
    db.query(eventsQuery, [userid, username], (eventsError, eventsResults) => {
      if (eventsError) {
        console.error('Error fetching events data:', eventsError);
        return res.status(500).json({ error: 'Error fetching events data' });
      }

      res.json(eventsResults);
    });
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
