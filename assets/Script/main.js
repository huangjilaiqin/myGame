
const Network = require('Network');
const globalsInfo = require('globalsInfo');
const config = require('config');

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
        bgAudio:{
            default:null,
            url:cc.AudioClip
        },
    },

    // use this for initialization
    onLoad: function () {
        
        var netInstance = Network.getInstance(config.serverIp,config.serverPort,function(){
            
            cc.log('onconnect');
            //显示广告
            //显示公告
            //显示更新

            var response = netInstance.emit('testMessage','net test');
            netInstance.listeneOn('testMessage', function(obj){
                console.log('testMessage response:'+obj);
            });
            var userid = parseInt(cc.sys.localStorage.getItem('userid'));
            cc.log('userid type:',typeof(userid));
            var token = cc.sys.localStorage.getItem('token');
            var username = cc.sys.localStorage.getItem('username');
            if(!userid || userid.length===0){
                cc.director.loadScene('login');
            }else{
                //验证登录是否过期
                netInstance.emit('verifyToken', JSON.stringify({'userid':userid,'token':token}));
                netInstance.listeneOn('verifyToken', function(obj){
                    console.log(obj);
                    var result = JSON.parse(obj);
                    if(result.error){
                        cc.log("verifyToken: "+result.error);
                        cc.director.loadScene('login');
                    }else{
                        globalsInfo.userid=userid;
                        globalsInfo.token=token;
                        globalsInfo.username=username;
                        cc.log('verifyToken success');
                    }
                });
            }
        });
        //*/
        //cc.audioEngine.playMusic(this.bgAudio, true);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    searchOpponent:function(){
        var netInstance = Network.getInstance();
        netInstance.emit('searchOpponent', JSON.stringify({'userid':globalsInfo.userid,'token':globalsInfo.token}));
        netInstance.listeneOn('searchOpponent', function(obj){
            cc.log(obj);
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("search: "+result.error);
            }else{
                //cc.audioEngine.stopMusic();
                cc.log('search result');
                cc.log(result);
                globalsInfo.opponent = result;
                cc.director.loadScene('mirrorFight');
            }
        });
    },
});
