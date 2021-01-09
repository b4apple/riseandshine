const express = require('express');
const path = require('path');
const bodyparser = require('body-parser')
const nedb = require('nedb');

const db = new nedb({filename: 'db.json'});

db.loadDatabase();

const app = express();

const PORT = 3000;

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    response.render('index');
});

[]

app.listen(PORT, () => {
    console.log(`Server started at https://localhost:${PORT}`);
})