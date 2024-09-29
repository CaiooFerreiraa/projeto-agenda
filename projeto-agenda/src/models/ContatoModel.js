const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true},
  sobrenome: {type: String, required: false, default: ''},
  email: {type: String, required: false, default: ''},
  telefone: {type: String, required: false, default: ''},
  criadoEm: {type: Date, default: Date.now() }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.error = [];
    this.contato = null;
  }

  async register() {
    this.validate();

    if(this.error.length > 0) return;
    this.contato = await ContatoModel.create(this.body);
  }

  validate() {
    this.cleanUp();

    if(!this.body.nome) this.error.push('Nome é um campo obrigatório');
    if(this.body.email && !validator.isEmail(this.body.email)) this.error.push('Email inválido');
    if(!this.body.email && !this.body.telefone) this.error.push('Pelo menos email ou telefone devem ser enviado');
  }
  
  cleanUp() {
    for(const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      } 
    }

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone
    }
  }

  static async buscaPorId(id) {
    if (typeof id !== 'string') return;
    const user = await ContatoModel.findById(id);

    return user;
  }

  async edit(id) {
    if (typeof id !== 'string') return;

    this.validate();
    if (this.error.length > 0) return;

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true});
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    this.contato = await ContatoModel.findOneAndDelete({_id: id});
    return this.contato;
  }

  static async searchContact() {
    const contatos = await ContatoModel.find()
      .sort({criadoEm: -1});
    return contatos
  }
}

module.exports = Contato;