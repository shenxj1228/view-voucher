var filelist = require('./file.js');
var fs = require('fs');
var path = require('path');
var _self = this;
var cfg = require('../config.js');
var rootPath = (cfg.voucherPath || cfg.voucherPath.trim() != '') ? path.normalize(cfg.voucherPath) : path.join(process.cwd(), 'vouchers');

exports.getList = function(req, cb) {
    dir = (req.params.path === '_top') ? rootPath : new Buffer(req.params.path, 'base64').toString();
    filelist.getList(dir, function(data, err) {
        if (err) {
            cb(null, err);
            return;
        }

        cb(data, null);
    });
}

exports.getFileContext = function(req, cb) {
    file = new Buffer(req.params.path, 'base64').toString();
    fs.readFile(file, function(err, data) {
        if (err) {
            cb(null, err);
            return;
        }
        cb(data.toString(), null);
    });
}

exports.setFileContext = function(req, cb) {
    file = new Buffer(req.params.path, 'base64').toString();
    fs.rename(file, file + '.bak', (err) => {
        if (err) {
            cb(null, err);
            return;
        }
        fs.writeFile(file, req.body.context, (err) => {
            if (err) {
                cb(null, err);
                return;
            }
            console.log(file)
            fs.unlinkSync(file+ '.bak');
            cb(file, null);
        });
    })
}
