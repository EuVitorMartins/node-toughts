const express = require('express');
const router = express.Router();
const ToughtController = require('../controllers/ToughtController');

//helpers
const checkAuth = require('../helpers/auth').chechAuth;

router.get('/', ToughtController.showToughts);
router.get('/dashboard', checkAuth, ToughtController.dashboard);
router.get('/add', checkAuth, ToughtController.createToughts);
router.post('/add', checkAuth, ToughtController.createToughtsSave);
router.post('/remove', checkAuth, ToughtController.removeTought);
router.get('/edit/:id', checkAuth, ToughtController.updateTought);
router.post('/edit', checkAuth, ToughtController.updateToughtSave);

module.exports = router; 