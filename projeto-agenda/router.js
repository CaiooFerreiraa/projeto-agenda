const express = require('express');
const router = express.Router();
const homeControler = require('./src/controllers/homeControler');
const loginControler = require('./src/controllers/loginCrontroler');
const contatoControler = require('./src/controllers/contatoControler');
const { loginRequired } = require('./src/middlewares/middlewares')

router.get('/', homeControler.index);

//Rotas de login
router.get('/login', loginControler.index);
router.post('/login/register', loginControler.register);
router.post('/login/firstLogin', loginControler.firstLogin);
router.get('/login/logout', loginControler.logout);

//Rotas de contato
router.get('/contato', loginRequired, contatoControler.index);
router.get('/contato/:id', loginRequired, contatoControler.editIndex);
router.post('/contato/register', loginRequired, contatoControler.register);
router.post('/contato/edit/:id', loginRequired, contatoControler.edit);
router.get('/contato/delete/:id', loginRequired, contatoControler.delete);

module.exports = router;