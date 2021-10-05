// Import from Express
const express = require('express');
// Import Middleware
const bodyParser = require('body-parser');
const cors = require('cors');
// Import dotenv 
require('dotenv').config()

// MongoDB 
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.glehh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Create App
const app = express()
// Use Middleware into App
app.use(bodyParser.json());
app.use(cors());
// Create Port
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorCare").collection("appointments");
    console.log('DataBase Connected')


    // Add Patients Appointment API (Client site to Server)
    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })


    //  Return Patients Appointment API (Server to Client site)
    app.post('/appointmentsByDate', (req, res) => {
        const myDate = req.body;
        appointmentCollection.find({ appointmentDate:  myDate.bookedDate } )
        .toArray((err, documents) => {
            res.send(documents);
        })
    })


    // All Patients Get (Server to Client site)
    app.get('/appointments', (req, res) => {
        appointmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //   client.close();
});

app.get('/', (req, res) => {
    res.send("Database working...")
})

app.listen(process.env.PORT || port)

