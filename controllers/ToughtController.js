const { raw } = require('mysql2');
const Tought = require('../models/Tought');
const User = require('../models/User');
const { where } = require('sequelize');
const { Op } = require('sequelize')

module.exports = class ToughtController {

    static async showToughts(req, res) {
        // Busca pela barra pesquisa 
        let search = '';
        if(req.query.search)search = req.query.search;

        //Ordernar
        let order = 'DESC'
        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }
        
        //consultando os pensamentos e user
        const toughtsData = await Tought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            order: [['createdAt', order]],
        })
        //filtrando os pensamentos  
        const toughts = toughtsData.map((result) => result.get({plain: true}))

        const toughtsQty = toughts.length;
        if(toughtsQty === 0) toughts= false;

        res.render('toughts/home', { toughts, search, toughtsQty})
    }

    static async dashboard(req, res) {
        const userId = req.session.userid;

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Tought,
            plain: true
        })

        // Check se user exist
        if (!user) req.redirect('/login');

        //Filtrar os Tought
        const toughts = user.Toughts.map((result) => result.dataValues)

        let emptyToughts = false;

        if (toughts.length === 0) {
            emptyToughts = true;
        }

        res.render('toughts/dashboard', { toughts, emptyToughts })
    }

    static async createToughts(req, res) {
        res.render('toughts/create')
    }

    static async createToughtsSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Tought.create(tought);

            req.flash('message', 'Pensamento Criado com Sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log('Aconteceu um erro:' + error);
        }
    }

    static async removeTought(req, res) {
        const id = req.body.id;
        const UserId = req.session.userid;


        try {
            await Tought.destroy({ where: { id: id, UserId: UserId } });

            req.flash('message', 'Pensamento removido com Sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log('Aconteceu um erro:' + error);
        }
    }

    static async updateTought(req, res) {
        const id = req.params.id

        const tought = await Tought.findOne({ where: { id: id }, raw: true })

        res.render('toughts/edit', { tought })
    }

    static async updateToughtSave(req, res) {
        const id = req.body.id;

        const tought = {
            title: req.body.title,
        }

        try {
            await Tought.update(tought, { where: { id: id } });

            req.flash('message', 'Pensamento Editado com Sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log('Aconteceu um erro:' + error);
        }
    }
}
