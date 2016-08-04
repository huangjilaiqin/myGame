/*
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        cc.log('qqSdk');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
*/
var ver = "1.0.1";
try {
    ver = opener.QC.getVersion();
} catch(e) {}
ver = ver ? "-" + ver: ver;
/*
var qc_script;
var reg = /\/qzone\/openapi\/qc_loader\.js/i;
var scripts = document.getElementsByTagName("script");
for (var i = 0, script, l = scripts.length; i < l; i++) {
    script = scripts[i];
    var src = script.src || "";
    var mat = src.match(reg);
    if (mat) {
        qc_script = script;
        break;
    }
}
*/
var s_src = 'http://qzonestyle.gtimg.cn/qzone/openapi/qc' + ver + '.js';
var arr = ['src=' + s_src + ''];
/*
for (var i = 0,att; i < qc_script.attributes.length; i++) {
    att = qc_script.attributes[i];
    if (att.name != "src" && att.specified) {
        arr.push([att.name.toLowerCase(), '"' + att.value + '"'].join("="));
    }
}*/
arr.push('data-appid="101341128"');
arr.push('data-redirecturi="http://www.pushup.gandafu.com"');
arr.push('charset="utf-8"');

if (document.readyState != 'complete') {
    document.write('<script ' + arr.join(" ") + ' ><' + '/script>');
    document.write('');
} else {
    var s = document.createElement("script"),
    attr;
    s.type = "text/javascript";
    s.src = s_src;
    for (var i = arr.length; i--;) {
        attr = arr[i].split("=");
        if (attr[0] == "data-appid" || attr[0] == "data-redirecturi" || attr[0] == "data-callback") {
            s.setAttribute(attr[0], attr[1].replace(/\"/g, ""));
        }
    }
    var h = document.getElementsByTagName("head");
    if (h && h[0]) {
        h[0].appendChild(s);
    }
}
cc.log('qqSdk2');