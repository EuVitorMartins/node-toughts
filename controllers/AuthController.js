const User = require('../models/User')
const bcrypt = require('bcryptjs')
module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body;

        //Valida usuario
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            req.flash('message', 'Usuario não encontrado')
            res.render('auth/login')

            return
        }

        //Valida password
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if (!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')

            return
        }

        //logando o User
        req.session.userid = user.id;

        req.session.save(() => {
            res.redirect('/')
        })
    }


    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body;

        //  Valida Senha
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não são iguais.')
            res.render('auth/register')
            return
        }

        // Valida o usuario se exite

        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash('message', 'O e-mail ja esta em uso!');
            res.render('auth/register');

            return
        }

        // Senha
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            const createUser = await User.create(user);

            //logando o User
            req.session.userid = createUser.id;

            req.flash('message', 'Cadastro realizado com sucesso!')
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (err) {
            console.log(err);
        }

    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

}
