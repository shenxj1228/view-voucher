var filecontroller = require('./lib/filecontroller.js');
var Router = require('express').Router;
var router = new Router();

router.route('/files/:path').get(function(req, res, next) {
    filecontroller.getList(req, function(data, err) {
        if (err) {
            res.status(404).json(err);
            return;
        }
        res.status(200).json(data);
    })
});


router.route('/file/:path').get(function(req, res, next) {
	//console.log(req.params.path)
    filecontroller.getFileContext(req, function(data, err) {
        if (err) {
            res.status(404).json(err);
            return;
        }
        res.status(200).json(data);
    })
})
.post(function(req,res,next){
 filecontroller.setFileContext(req, function(data, err) {
         if (err) {
             res.status(404).json(err);
             return;
         }
         res.status(200).json(data);
     })
})

module.exports = router;
