const express = require('express');
const path = require('path');
const bodyparser = require('body-parser')
const nedb = require('nedb');
const { request } = require('http');
const { response } = require('express');

const userdb = new nedb({ filename: 'db.json' });

userdb.loadDatabase();

const app = express();

const PORT = 3000;

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.use(bodyparser.json());


app.get('/', (request, response) => {
    response.render('index');
});

app.post('/login', (request, response) => {
    
});

app.post('/signup', (request, response) => {
    userdb.insert({ name: request.params.name, password: request.params.password });
});


app.listen(PORT, () => {
    console.log(`Server started at https://localhost:${PORT}`);
})