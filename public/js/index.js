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
    var paddingWidth = 19.5;
    $(document).ready(function() {
        zTreeObj = $.fn.zTree.init($("#fileTree"), Zsetting, zNodes);
        if (window.localStorage) {
            if (window.localStorage.paddingWidth && window.localStorage.paddingWidth != '') {
                paddingWidth = parseFloat(window.localStorage.paddingWidth);

            } else {
                window.localStorage.paddingWidth = paddingWidth;
            }
        }
        $('#inputPand').val(paddingWidth);
        $('.paperA4').css('padding', '0 ' + paddingWidth + 'mm');
        $('#inputPand').on('change', function() {
            paddingWidth = parseFloat($('#inputPand').val());
            window.localStorage.paddingWidth = paddingWidth;
             $('.paperA4').css('padding', '0 ' + paddingWidth + 'mm');
        });
    });

    $(document).on('keydown', function(e) {
        if (e.ctrlKey && e.which === 83) {
            e.preventDefault();
            e.stopPropagation();
            if (currentNode && currentNode.secPath)
                save();
            return false;
        }
    });

    $('#saveReflash').on('click', function() {
        save();
    });

    function save() {
        if (currentNode.secPath) {
            $.post('/file/' + currentNode.secPath, { context: htmlToString($('#voucherContentEditHeader').val() + $('#voucherContentEditBody').val()) })
                .done(function(data) {
                    getdataTOhtml(currentNode);
                    $.toaster({ message: '保存成功', title: '保存', priority: 'success' });
                })
                .fail(function(err) {
                    $.toaster({ message: err, title: '保存', priority: 'danger' });
                });
        } else {
            alert('请选择一个凭单');
        }
    }
    $('.btn-move').on('click', function() {
        if ($(this).parent().hasClass('col-xs-12')) {
            $(this).parent().removeClass('col-xs-12').addClass('col-xs-6');
            $(this).parent().siblings().css('display', 'block');
        } else {
            $(this).parent().removeClass('col-xs-6').addClass('col-xs-12');
            $(this).parent().siblings().css('display', 'none');
        }
        if ($(this).find('.glyphicon').hasClass('glyphicon-chevron-left')) {
            $(this).find('.glyphicon').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
        } else {
            $(this).find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
        }
    })



    function ZonClick(event, treeId, treeNode, clickFlag) {
        if (!treeNode.isParent) {
            getdataTOhtml(treeNode);
        } else {
            $('.paperA4').removeClass('paper-border');
            $('#voucherContentView').removeClass('inner-border');
            $('#voucherContentView').html('');
            $('.view-top').css('display', 'block');
            $('.view-bottom').css('display', 'block');
            $('#voucherContentEditHeader').val('');
            $('#voucherContentEditBody').val('');
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
                $('.paperA4').addClass('paper-border');
                $('#voucherContentView').addClass('inner-border');
                $('#voucherContentView').html(vucherHtml);
                $('.view-top').css('display', 'none');
                $('.view-bottom').css('display', 'none');
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
        if (data.split('!STYLEEND').length > 1) {
            return data.split('!STYLEEND')[1].replace(/\n/ig, '<br/>').replace(/\s/ig, '&ensp;');
        }else{
            alert('凭单格式不正确，缺少【!STYLEEND】');
        }
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
