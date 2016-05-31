
const Test = require('Test');
const Network = require('Network');

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
        cc.log(Test);
        var test = new Test();
        test.foo();
        var network = new Network();
        //cc.log(network.getInstance(undefined,undefined,function(){cc.log('getInstance');}));
        //cc.log(network.getInstance());
        var netInstance = network.getInstance("123.59.40.113",5002,function(){
            
            cc.log('onconnect');
            //显示广告
            //显示公告
            //显示更新

            var response = netInstance.emit('testMessage','net test');
            netInstance.listeneOn('testMessage', function(obj){
                console.log('testMessage response:'+obj);
            });
            var userid = parseInt(cc.sys.localStorage.getItem('userid'));
            cc.log('userid type:',typeof(userid))
            var token = cc.sys.localStorage.getItem('token');
            var username = cc.sys.localStorage.getItem('username');
            if(!userid || userid.length===0){
                cc.director.loadScene('login');
            }else{
                //验证登录是否过期
                netInstance.emit('verifyToken', JSON.stringify({'userid':userid,'token':token}));
                netInstance.listeneOn('verifyToken', function(obj){
                    console.log(obj);
                    result = JSON.parse(obj);
                    if(result['error']){
                        cc.log("verifyToken: "+result['error']);
                        cc.director.runScene(new LoginScene());
                    }else{
                        globalsInfo['userid']=userid;
                        globalsInfo['token']=token;
                        globalsInfo['username']=username;
                        cc.director.runScene(new MenuScene());
                    }
                });
            }
        });
        //cc.audioEngine.playMusic(this.bgAudio, true);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    searchOpponent:function(){
        cc.log('searchOpponent');
    },
});
