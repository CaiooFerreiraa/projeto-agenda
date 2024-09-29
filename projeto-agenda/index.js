require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const routes = require('./router');
const { middlewareGlobal, checkCsrfError, createCsrf } = require('./src/middlewares/middlewares')
const port = 8080;

mongoose.connect(process.env.CONNECTSTRING) //retorna uma promisse
  .then(() => {
    app.emit(200); //Emite um sinal pra informar ao express
  })
  .catch(e => {
    console.error(e)
  });

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOption = session({
  secret: process.env.SECRET,
  store: MongoStore.create({mongoUrl: process.env.CONNECTSTRING}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true 
  }
});

app.use(sessionOption);
app.use(flash());
// app.use(helmet({
//   xPoweredBy: false
// }))

app.set('views', path.resolve(__dirname, "src", 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
// Nossos proprios midlewares
app.use(middlewareGlobal)
app.use(checkCsrfError);
app.use(createCsrf);
app.use(routes);

//Recebe o sinal vindo do emit e em seguida executa a função, que nesse caso é onde inicia meu servidor
app.on(200, () => app.listen(port, () => console.log(`http://localhost:${port}`)))
