const Login = require('../models/LoginModel');

exports.index = (req, res, next) => {
  if (req.session.user) return res.render('login-logado') 

  return res.render('login');
}

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();
    
    if (login.error.length > 0) {
      req.flash('error', login.error);
      req.session.save(() => {
        return res.redirect('back');
      })
      return;
    }

    req.flash('success', login.success)
    req.session.save(() => {
      return res.redirect('back');
    })
  } catch (e) {
    console.error(e);
    return res.render('error')
  }
}

exports.firstLogin = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.login();
    
    if (login.error.length > 0) {
      req.flash('error', login.error);
      req.session.save(() => {
        return res.redirect('back');
      })
      return;
    }

    req.flash('success', login.success)
    req.session.user = login.user;
    req.session.save(() => {
      return res.redirect('back');
    })
  } catch (e) {
    console.error(e);
    return res.render('error')
  }
}

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
}