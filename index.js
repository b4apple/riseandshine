require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nedb = require('nedb');
const multer = require('multer');
const { request } = require('http');
const { response } = require('express');

const userdb = new nedb({ filename: 'db.json' });
const upload = multer();
userdb.loadDatabase();

const app = express();

const PORT = 3000;

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use(require('express-session')({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: false
  }))
  
  const { ExpressOIDC } = require('@okta/oidc-middleware')
  const oidc = new ExpressOIDC({
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
    scope: 'openid profile'
  })
  
  app.use(oidc.router)



app.get('/', (request, response) => {
    response.render('index', {status:'fresh'});
});

app.get('/signup', (request, response) => {
    response.render('signup', {status: 'fresh'});
});

app.get('/login', (request, response) => {
    response.render('login', {status: 'fresh'});
});

app.get('/questions', (request, response) => {
    response.render('questions');
});

app.get('/redirect', (request, response) => {
    response.render('index', {status: 'ld'});
});


app.post('/login', (request, response) => {
    const res = userdb.find({name: request.body.name, pwd: request.body.pwd}, (err, res) => {
        if(err || res.length == 0){
            response.render('login', {status:'fail'});
        }
        else {
            response.render('login', {status:'ld', name: request.body.name});
        }
    });
});

app.post('/signup', upload.none(), (request, response) => {
    const data = { name: request.body.name, pwd: request.body.pwd };
    userdb.find(data, (err, res) => {
        if(err | res.length == 0){
            response.render('signup', {status: 'fail' });
        }
        else {
            userdb.insert(data);
            response.render('signup', {status: 'ld', name: data.name});
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server started at https://localhost:${PORT}`);
})