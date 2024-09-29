const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.success = [];
    this.error = [];
    this.user = null;
  }

  validate() {
    this.cleanUp();

    // Checa email
    if (!validator.isEmail(this.body.email)) this.error.push('E-mail inválido');
    if (this.body.password.length < 3 || this.body.password.length >= 50) {
      this.error.push('A senha deve ter entre 3 a 50 caracteres');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      } 
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }

  async register() {
    this.validate();
    //Primeiro valida os dados do formulário
    if (this.error.length > 0) return;

    this.userExists();
    // Faz uma nova validação para saber se já existe um usuário cadastrado
    if (this.error.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    
    this.user = await LoginModel.create(this.body);
    this.success.push('Usuário criado com sucesso');
  }

  async login() {
    this.validate();
    //Primeiro valida os dados do formulário
    if (this.error.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if(!this.user) {
      this.error.push('Usuário não existe')
      return;
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.error.push('Senha ou usuário inválido');
      this.user = null;
      return;
    }
    this.success.push('Usuário logado com sucesso');
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email })
    if (user) this.error.push('Usuário já existe');
  }
}

module.exports = Login;
