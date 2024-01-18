module.exports.chechAuth = function(req, res, next) {
    const userId = req.session.userid;

    if (!userId){
        res.redirect('/login');
        return
    } 

    next()
}