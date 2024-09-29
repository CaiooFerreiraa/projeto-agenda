const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
  res.render('contato', {
    contato: {}
  })
  return;
}

exports.register = async (req, res, next) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();
  
    if (contato.error.length > 0) {
      req.flash('error', contato.error);
      req.session.save(() => { res.redirect('back') })
      return;
    }
  
    req.flash('success', "Contato cadastrado com sucesso");
    req.session.save(() => { 
      return res.redirect(`/contato/${contato.contato._id}`);
    })
  } catch (e) {
    console.error(e)
    return res.render('error');
  }
}

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render('error');
  const contato = await Contato.buscaPorId(req.params.id);

  if(!contato) return res.render('error')
  res.render('contato', { contato })
}

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render('error');
    const contato = new Contato(req.body);
  
    await contato.edit(req.params.id);
  
    if (contato.error.length > 0) {
      req.flash('error', contato.error);
      req.session.save(() => { res.redirect('back') })
      return;
    }
  
    req.flash('success', "Contato cadastrado com sucesso");
    req.session.save(() => { 
      return res.redirect(`/contato/${contato.contato._id}`);
    })
  } catch (e) {
    console.error(e)
    res.render('error')
  }
}

exports.delete = async (req, res) => {
  try {
    if (!req.params.id) return res.render('error');
    await Contato.delete(req.params.id);
  
    req.flash('success', "Contato deletado com sucesso");
    req.session.save(() => { 
      return res.redirect(`back`);
    })
    
  } catch (e) {
    console.error(e)
    res.render('error')
  }
}