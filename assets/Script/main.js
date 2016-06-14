
const Network = require('Network');
const globalsInfo = require('globalsInfo');
const config = require('config');

cc.Class({
    extends: cc.Component,
    properties: {
        bgAudio:{
            default:null,
            url:cc.AudioClip
        },
        tip:{
            default:null,
            type:cc.Label,
        },
        searchPre: {
            default: null,
            type: cc.Prefab
        },
        searchPreInst:{
            default:null,
            visible:false,
        },
        total:{
            default:null,
            type:cc.Label,
        },
        win:{
            default:null,
            type:cc.Label,
        },
        draw:{
            default:null,
            type:cc.Label,
        },
        lost:{
            default:null,
            type:cc.Label,
        },
        volumeSettingBt:{
            default:null,
            type:cc.Button,
        },
        volumeOff:{
            default:null,
            type:cc.Sprite,
        },
        volumeOn:{
            default:null,
            type:cc.Sprite,
        },
        loadingPrefab: {
            default: null,
            type: cc.Prefab
        },
    },
    changeVolumeBg:function(isOpen){
        if(isOpen){
            this.volumeOn.node.opacity=255;
            this.volumeOff.node.opacity=0;
        }else{
            this.volumeOn.node.opacity=0;
            this.volumeOff.node.opacity=255;
        }
    },
    // use this for initialization
    onLoad: function () {
        cc.log('main onLoad');
        
        var isVolumeOpen = cc.sys.localStorage.getItem('isVolumeOpen');
        if(isVolumeOpen===null){
            cc.sys.localStorage.setItem('isVolumeOpen',1);
            isVolumeOpen='1';
        }
        isVolumeOpen=parseInt(isVolumeOpen);
        cc.log('isVolumeOpen',isVolumeOpen);
        globalsInfo.isVolumeOpen=isVolumeOpen;
        this.changeVolumeBg(isVolumeOpen);
        
        var tip = this.tip;
        this.searchPreInst=cc.instantiate(this.searchPre);
        this.searchPreInst.setPosition(cc.p(0,0));
        //this.node.addChild(this.searchPreInst,1,1000);
        if(globalsInfo.isStartUp===undefined){
            var loading = cc.instantiate(this.loadingPrefab);
            loading.setPosition(cc.p(0,50));
            this.node.addChild(loading,1,2000);
            globalsInfo.isStartUp=1;
        }
        var that = this;
        var netInstance = Network.getInstance(config.serverIp,config.serverPort,function(){
            that.node.removeChildByTag(2000);
            cc.log('onconnect');
            //显示广告
            //显示公告
            //显示更新

            var userid = parseInt(cc.sys.localStorage.getItem('userid'));
            cc.log('userid type:',typeof(userid));
            var token = cc.sys.localStorage.getItem('token');
            //tip.string='token:'+token;
            var username = cc.sys.localStorage.getItem('username');
            if(!userid || userid.length===0){
                cc.director.loadScene('login');
            }else{
                //验证登录是否过期
                cc.log('to verifyToken');
                netInstance.emit('verifyToken', JSON.stringify({'userid':userid,'token':token}));
                netInstance.listeneOn('verifyToken', function(obj){
                    console.log('verifyToken',obj);
                    var result = JSON.parse(obj);
                    if(result.error){
                        cc.log("verifyToken: "+result.error);
                        cc.director.loadScene('login');
                    }else{
                        cc.log('verifyToken success');
                        
                        globalsInfo.userid=userid;
                        globalsInfo.token=token;
                        globalsInfo.username=username;
                        
                        globalsInfo.value=result.value;
                        globalsInfo.total=result.total;
                        globalsInfo.win=result.win;
                        globalsInfo.draw=result.draw;
                        globalsInfo.lost=result.lost;
                        cc.log(globalsInfo);
                        //tip=token;
                        
                        that.win.string=globalsInfo.win;
                        that.draw.string=globalsInfo.draw;
                        that.lost.string=globalsInfo.lost;
                        that.total.string='总数:'+globalsInfo.total;
                    }
                });
            }
        });
        if(globalsInfo.isLogin){
            //重新登录的情况
            this.win.string=globalsInfo.win;
            this.draw.string=globalsInfo.draw;
            this.lost.string=globalsInfo.lost;
            this.total.string='总数:'+globalsInfo.total;
            globalsInfo.isLogin=0;
            this.node.removeChildByTag(2000);
        }else{  
            this.win.string= globalsInfo.win!==undefined?globalsInfo.win:0;
            this.draw.string=globalsInfo.draw!==undefined?globalsInfo.draw:0;
            this.lost.string=globalsInfo.lost!==undefined?globalsInfo.lost:0;
            var total = globalsInfo.total!==undefined?globalsInfo.total:0;
            this.total.string='总数:'+total;
        }
        //*/
        if(globalsInfo.isVolumeOpen)
            cc.audioEngine.playMusic(this.bgAudio, true);
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    searchOpponent:function(){
        var netInstance = Network.getInstance();
        var tip=this.tip;
        this.node.addChild(this.searchPreInst,1,1000);
        //this.node.addChild(this.searchPreInst,1,1000);
        var begin = new Date().getTime();
        var that = this;
        netInstance.emit('searchOpponent', JSON.stringify({'userid':globalsInfo.userid,'token':globalsInfo.token}));
        netInstance.listeneOn('searchOpponent', function(obj){
            cc.log(obj);
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("search: "+result.error);
                this.node.removeChildByTag(1000);
                tip=result.error;
            }else{
                cc.log('search result');
                cc.log(result);
                globalsInfo.opponent = result;
                var now = new Date().getTime();
                var delta = now-begin;
                if(delta<2000){
                    that.schedule(function(){
                        cc.director.loadScene('mirrorFight');
                        cc.audioEngine.stopMusic();
                    },(2000-delta)/1000);
                }
            }
        });
    },
    rank:function(){
        cc.director.loadScene('rank');
    },
    fightRecord:function(){
        cc.director.loadScene('fightRecords');
    },
    volumeSetting:function(){
        if(globalsInfo.isVolumeOpen==1){
            globalsInfo.isVolumeOpen=0;
            cc.sys.localStorage.setItem('isVolumeOpen',globalsInfo.isVolumeOpen);
            cc.audioEngine.stopMusic();
            this.changeVolumeBg(globalsInfo.isVolumeOpen);
        }else{
            globalsInfo.isVolumeOpen=1;
            cc.sys.localStorage.setItem('isVolumeOpen',globalsInfo.isVolumeOpen);
            cc.audioEngine.playMusic(this.bgAudio, true);
            this.changeVolumeBg(globalsInfo.isVolumeOpen);
        }
    },
});
