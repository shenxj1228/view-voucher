var path = require('path');
var fs=require('fs');
var Finder = require('fs-finder');
var cfg = require('../config.js');
var rootPath = (cfg.voucherPath || cfg.voucherPath.trim() != '') ? path.normalize(cfg.voucherPath) : path.join(process.cwd() ,'vouchers');

/**
 * 获取路径下的文件和文件夹
 * @param  {string} 路径字符串
 * @param  {Function} 回调函数
 * {
        rootPath: 根目录,
        currentdir: 当前路径,
        backdir: 上一路径,
        istop: 是否根目录,
        content: {
            folders: 文件夹数组,
            files: 文件数组
        }
   }, null
 */
exports.getList = function(_path, cb) {
    var currentdir = _path.replace(rootPath, "").split(path.sep);
    
    fs.exists(_path, function(iexists) {
        if (!iexists) {
            cb(null, new Error('路径不存在！'));
            return;
        }

        fs.readdir(_path, function(err, files) {
            if (err) {
                cb(null, err);
                return;
            }
            var fileArray = [];
            var folderArray = [];
            files.forEach(function(fileName) {
                var statInfo = fs.statSync(path.join(_path, fileName));
                if (statInfo.isFile()) {
                    fileArray.push(new FileProperty(path.join(_path, fileName),fileName));
                }
                if (statInfo.isDirectory()) {
                    folderArray.push(new FileProperty(path.join(_path, fileName),fileName));
                }
            });
            currentdir = currentdir.join(path.sep);
            cb({
                rootPath: rootPath,
                currentdir: currentdir,
                backdir: new Buffer(path.dirname(_path)).toString('base64'),
                istop: (path.dirname(_path) == path.dirname(rootPath)) ? true : false,
                list: {
                    folders: folderArray,
                    files: fileArray
                }
            }, null);

        });
    });
}

/**
 * @param {string} 路径
 * @param {string} 名称
 */
function FileProperty(_path,  _name) {
    this.path = _path;
    this.name = _name;
    this.secPath = new Buffer(_path).toString('base64');
};
