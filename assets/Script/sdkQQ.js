
if(!cc.sys.isNative){
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
    arr.push('data-appid="101337231"');
    arr.push('data-redirecturi="http://www.helloworld.gandafu.com/"');
    arr.push('charset="utf-8"');
    
    if (document.readyState != 'complete') {
        document.write('<script ' + arr.join(" ") + ' ><' + '/script>');
        document.write('<span id="qqLoginBtn"></span>');
    } else {
        var s = document.createElement("script"),attr;
        s.type = "text/javascript";
        s.src = s_src;
        for (var i = arr.length; i--;) {
            attr = arr[i].split("=");
            if (attr[0] == "data-appid" || attr[0] == "data-redirecturi" || attr[0] == "data-callback") {
                s.setAttribute(attr[0], attr[1].replace(/\"/g, ""));
            }
        }
        var span = document.createElement("span");
        span.id="qqLoginBtn";
        var h = document.getElementsByTagName("head");
        if (h && h[0]) {
            h[0].appendChild(s);
            h[0].appendChild(span);
        }
    }
    cc.log('qqSdk2');
}