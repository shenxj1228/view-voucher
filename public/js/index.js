(function() {
    'use strict';
    var zNodes = [{
        name: "凭单目录",
        path: "",
        secPath: "_top",
        isParent: true
    }];
    var Zsetting = {
        async: {
            enable: true,
            url: getAsyncUrl,
            type: "get",
            dataFilter: Zfilter
        },
        data: {
            key: {
                title: "",
                name: "name"
            }
        },
        callback: {
            onClick: ZonClick
        },
        view: {
            showLine: false,
            autoCancelSelected: false,
            selectedMulti: false,

        }
    };
    var currentNode;
    var zTreeObj;
    $(document).ready(function() {
        zTreeObj = $.fn.zTree.init($("#fileTree"), Zsetting, zNodes);
    });
    $('#saveReflash').on('click', function() {
    	if(currentNode.secPath){
        $.post('/file/' + currentNode.secPath, { context: htmlToString($('#voucherContentEditHeader').val() + $('#voucherContentEditBody').val()) })
            .done(function(data) {
                alert('success');
                getdataTOhtml(currentNode);
            })
            .fail(function(err) {
                alert(err);
            });
        }else{
        	alert('请选择一个凭单');
        }
    });

    $('.btn-move').on('click', function() {
        if ($(this).parent().hasClass('col-xs-12')) {
            $(this).parent().removeClass('col-xs-12').addClass('col-xs-6');
            $(this).parent().siblings().css('display', 'block');


        } else {
            $(this).parent().removeClass('col-xs-6').addClass('col-xs-12');
            $(this).parent().siblings().css('display', 'none');
        }
        console.log($(this).children('.glyphicon'));
        if ($(this).find('.glyphicon').hasClass('glyphicon-chevron-left')) {
            $(this).find('.glyphicon').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
        } else {
            $(this).find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
        }
    })



    function ZonClick(event, treeId, treeNode, clickFlag) {
        if (!treeNode.isParent) {
            getdataTOhtml(treeNode);
        }
    }

    function getAsyncUrl(treeId, treeNode) {
        return '/files/' + treeNode.secPath;
    };

    function Zfilter(treeId, parentNode, childNodes) {
        var fileArray = childNodes.list.files;
        var folderArray = childNodes.list.folders;
        folderArray.map(function(val) {
            val.isParent = true;
            return val;
        });
        fileArray.map(function(val) {
            val.isParent = false;
            return val;
        });
        return folderArray.concat(fileArray);
    }

    function getdataTOhtml(treeNode) {
        $.get('/file/' + treeNode.secPath)
            .done(function(data) {
                currentNode = treeNode;
                var vucherHtml = stringToHtml(data)
                $('#voucherContentView').html(vucherHtml);
                $('#voucherContentView').addClass('has-border');
                $('.view-top').css('display', 'none');
                $('#voucherContentEditHeader').val(cutFileContext(data)[0]);
                $('#voucherContentEditBody').val(cutFileContext(data)[1]);
            })
            .fail(function(err) {
                console.log(err);
                alert('加载异常！');
                zTreeObj.reAsyncChildNodes(treeNode.getParentNode(), 'refresh', false);
                currentNode = {};
            });
    }

    function stringToHtml(data) {
        return data.split('!STYLEEND')[1].replace(/\n/ig, '<br/>').replace(/\s/ig, '&nbsp;');
    }

    function htmlToString(data) {
        return data.replace(/\n/ig, '\r\n');
    }

    function cutFileContext(data) {
        var tmparr = data.split('!STYLEEND');
        tmparr[0] = tmparr[0] + '!STYLEEND';
        return tmparr;
    }
    String.prototype.format = function() {
        if (arguments.length == 0) return this;
        for (var s = this, i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    };

})();
