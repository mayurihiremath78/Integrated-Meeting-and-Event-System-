


// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mysql = require('mysql');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// const port = 8000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Create an HTTP server
// const server = http.createServer(app);

// // Create a Socket.IO server
// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('message', (msg) => {
//     console.log('Message received: ' + msg);
//     // Broadcast the message to all connected clients
//     io.emit('message', msg);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`A user connected on socket: ${socket.id}`);

  // Handle user connection
  socket.on('userConnected', (username) => {
    socket.username = username;
    console.log(`${username} connected`);
    // Notify all clients about the new user
    io.emit('userConnected', username);
  });

  // Handle messages
  socket.on('message', (msg) => {
    console.log(`Message from ${msg.userId}: ${msg.msg}`);
    // Broadcast message to all clients except sender
    socket.broadcast.emit('message', { userId: msg.userId, msg: msg.msg });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.username}`);
    if (socket.username) {
      // Notify all clients about the disconnection
      io.emit('userDisconnected', socket.username);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Enable CORS
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

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

app.post('/registerEvent', async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Handle the request
});

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

// Endpoint for Events history For USer events History
app.post('/EventsHistory', (req, res) => {
  const { userid, username } = req.body;

  // Validate user in the database
  const userQuery = 'SELECT * FROM users WHERE userid = ? AND username = ?';
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

// Register Event by User Endpoint
app.post('/registerEvent', async (req, res) => {
  try {
    const {
      eventid,
      eventname,
      hostname,
      description,
      techstack,
      startdate,
      enddate,
      payment,
      username,
      userid,
    } = req.body;

   

    // Create a new registration entry in the event_registrations table
    const registration = {
      userid,
      username,
      eventid,
      eventname,
      hostname,
      description,
      techstack,
      startdate,
      enddate,
      payment,
    };
    console.log(registration)
    // Insert the registration entry into the database
  //   const result = await db.query(`INSERT INTO event_registrations SET ?`, registration);
  //   console.log(result);

  //   // If the record is submitted to database correctly, redirect to EventsHistory page
  } catch (error) {
    console.error("ERORRORR ISSS:",error);
    res.status(500).send({ message: 'Error registering event' });
  }
});


//     // Insert the registration entry into the database

//User login API
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

//===============================================================================
//ADMIN API'S
//===========================================================================================

//Admin Login
app.post('/Admin_Login', (req, res) => {

  const { name, contact, username, password } = req.body;
  const query = 'INSERT INTO admin (name, contact, username, password) VALUES (?, ?, ?, ?)';
  db.query(query, [name,contact,username, password], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).send('Server error');
      return;
    }
    //res.status(200).send('User registered successfully');
    console.log("Admin Login SuccessFull");

  });
});


// API endpoint for fetching upcoming events
app.get('/UpcomingEvents', (req, res) => {
  const currentDate = new Date();
  const query = 'SELECT * FROM createevent WHERE date > ?';
  db.query(query, [currentDate], (error, results) => {
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

// API endpoint for fetching past events
app.get('/PastEvents', (req, res) => {
  const currentDate = new Date();
  const query = 'SELECT * FROM createevent WHERE enddate < ?';
  db.query(query, [currentDate], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      // Convert BLOB to base64 string if needed
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

// API endpoint for fetching ongoing events
app.get('/OngoingEvents', (req, res) => {
  const currentDate = new Date();
  const query = 'SELECT * FROM createevent WHERE date <= ? AND enddate >= ?';
  db.query(query, [currentDate, currentDate], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      // Convert BLOB to base64 string if needed
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

//API for admin evens history
  app.get('/Admin_EventsHistory', (req, res) => {
    const { username } = req.query;
  console.log(username);
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
  
    const query = `
      SELECT * FROM createevent
      WHERE hostname = ?
    `;
  
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error('Error fetching events:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      res.json(results);
    });
  });

  //Events Enrollment for Admin
  app.get('/Admin_EventsHistory/eventregistrations', (req, res) => {
    const eventname = req.query.eventname;
  console.log("Sercing registrations of ",eventname)
    // Example logic to fetch event registrations from the database
    const sql = 'SELECT * FROM event_registrations WHERE eventname = ?';
    db.query(sql, [eventname], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'No data in Database' });
      }
      console.log("Data is:",results)
      res.json(results);
    });
  });