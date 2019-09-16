/**
 * create by huyu_ ON 2019/2/15
 */
'use strict'
var output = document.getElementById('output'),
    input = document.getElementById('input'),
    lang = document.getElementById('lang'),
    clean = document.getElementById('clean');
var data,
    langObj = {},
    defaultLang = {
    addText: "新增",
    hintText: "温馨提示",
    paramsText: "参数为空!",
    addHintMessageText: "您确定要切换操作吗？未保存的数据可能会丢失!",
    okText: "确定",
    operateText: "操作",
    cancelText: "取消",
    saveText: "保存",
    appendText: "添加",
    saveMaskMessageText: "正在保存，请稍候...",
    modifyText: "编辑",
    deleteText: "删除",
    configText: "绑定",
    operateHintMessage: "请选择一条要操作的行项目!",
    deleteHintMessageText: "您确定要删除吗？",
    deleteMaskMessageText: "正在删除，请稍候...",
    queryMaskMessageText: "正在努力获取数据，请稍候...",
    includeChildrenText: "包含子节点",
    removeText: "移除",
    assignTest: "分配",
    tenantCodeText: "租户代码",
    searchDisplayText: "请输入关键字查询",
    searchBoxText: "请输入名称或代码查询",
    codeText: "代码",
    nameText: "名称",
    barCodeText: "条码",
    emptyMessageText: "请将必填项补充完整",
    unFilledText: "有必填项未输入，请确认！",
    addWinText: "新增{0}",
    modifyWinText: "编辑{0}",
    bookedDateText: "成册时间",
    barCodeQueryArchive: "请输入册号、条码号或名称进行查询",
    bookStatusText:"成册",
    timeCompareText:"开始日期必须小于结束日期",
};

//点击复制
output.onclick = function () {
    this.select();
    document.execCommand('Copy');
    var tips = document.getElementById('tips');
    tips.style.animation = 'tip_anim 2s';
    tips.style.webkitAnimation = 'tip_anim 2s';
    setTimeout(function () {
        tips.style.animation = '';
        tips.style.webkitAnimation = '';
    }, 2000);
};

clean.onclick = () => {
    input.value = "";
};

lang.onblur = handleLangInput;

function handleLangInput() {
    var val = lang.value.split(/,\n */);
    langObj = {...defaultLang};

    val.forEach(function (item) {
        if (/^\/\//.test(item) || /^\/\**/.test(item)) {
            return
        }
        var arr = item.split(":");
        langObj[arr[0]] = arr[1];

    });
};

//处理程序
(function () {
    var act = document.getElementById("act");

    act.onclick = function () {

        handleLangInput();

        var val = input.value;
        if (val.includes("colModel")){
            val = val.split("colModel:")[1].replace(/(\[\n*\s*{)|\]/g, '');
        }
        val = val.split(/},\s*{/);
        val = val.map(function (item) {

            var obj = {}, arr = item.split(',');

            arr.forEach(function (arrItem) {
                arrItem = arrItem.replace(/[ |\n]/g, '');

                if (/^[\s{}\[\]]*$/.test(arrItem)) {
                    return
                }
                obj[arrItem.split(":")[0]] = arrItem.split(":")[1];
            });

            return obj;
        });

        data = val.map(function (item) {
            if (!item.label || !item || item.hidden) {
                return;
            }

            // var obj = {}, langName = item.label.split("lang.")[1];
            // obj.title = langObj[langName] || langName;
            // obj.dataIndex = item.name.replace('"', '');
            // if(item.width)
            //     obj.width = parseInt(item.width);
            // if(item.align)
            //     obj.align = item.align.replace('"', '');
            // return obj;

            var obj = '', langName = item.label.split("lang.")[1];
            obj = `{
                title: ${langObj[langName] || langName},
                dataIndex: ${item.name},`;
            if (item.width)
                obj += `
                width: ${parseInt(item.width)},`;
            if (item.align)
                obj += `
                align: ${item.align},`;
            obj += `
            }`;
            return obj
        });

        output.value = data;
    }
})();