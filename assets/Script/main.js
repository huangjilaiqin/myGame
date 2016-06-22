
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
        hpPercent:{
            default:0,
            visible:false,
        },
        hpValueLabel:{
            default:null,
            type:cc.Label,
        },
        totalPercent:{
            default:0,
            visible:false,
        },
        totalValueLabel:{
            default:null,
            type:cc.Label,
        },
        hpProgressBar:{
            default:null,
            type:cc.ProgressBar,
        },
        totalProgressBar:{
            default:null,
            type:cc.ProgressBar,
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
        if (!cc.sys.isNative) {
            cc.log('main onLoad',location);
            if(location.search.length===0){
                cc.log('search is undefined');
            }
        }
        cc.log('hpPercent',this.hpPercent);
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
        
        //第一次启动
        if(globalsInfo.isStartUp===undefined){
            var loading = cc.instantiate(this.loadingPrefab);
            loading.setPosition(cc.p(0,50));
            this.node.addChild(loading,1,2000);
            globalsInfo.isStartUp=1;
        }
        var that = this;
        //重连加载数据,1.加载全局数据 2.本场景相关操作
        var netInstance = Network.getInstance(config.serverIp,config.serverPort,function(){
            
            cc.log('onconnect');
            //显示广告
            //显示公告
            //显示更新

            var isShowFightTip = cc.sys.localStorage.getItem('isShowFightTip');
            globalsInfo.isShowFightTip=isShowFightTip;

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
                        //tip=token;
                        
                        if(!that.node)
                            return;
                        that.node.removeChildByTag(2000);
                        that.win.string=globalsInfo.win;
                        that.draw.string=globalsInfo.draw;
                        that.lost.string=globalsInfo.lost;
                        that.total.string=globalsInfo.total;
                        
                        cc.log(result.remainhp);
                        cc.log(result.hp);
                        
                        that.hpPercent=result.remainhp/result.hp;
                        that.hpValueLabel.string=result.remainhp+"/"+result.hp
                        that.totalPercent=result.total/(result.total+100);
                        that.totalValueLabel.string=result.total+"/"+(result.total+100)
                    }
                });
            }
        });
        if(globalsInfo.isLogin){
            //重新登录的情况
            this.win.string=globalsInfo.win;
            this.draw.string=globalsInfo.draw;
            this.lost.string=globalsInfo.lost;
            this.total.string=globalsInfo.total;
            globalsInfo.isLogin=0;
            this.node.removeChildByTag(2000);
        }else{  
            this.win.string= globalsInfo.win!==undefined?globalsInfo.win:0;
            this.draw.string=globalsInfo.draw!==undefined?globalsInfo.draw:0;
            this.lost.string=globalsInfo.lost!==undefined?globalsInfo.lost:0;
            var total = globalsInfo.total!==undefined?globalsInfo.total:0;
            this.total.string=total;
        }
        //*/
        if(globalsInfo.isVolumeOpen)
            cc.audioEngine.playMusic(this.bgAudio, true);
        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.totalPercent!==0)
            this._updateProgressBar(this.totalProgressBar,this.totalPercent,dt);
        if(this.hpPercent!==0)
            this._updateProgressBar(this.hpProgressBar,this.hpPercent,dt);
    },
    
    _updateProgressBar: function(progressBar,percent,dt){
        var progress = progressBar.progress;
        if(progress < percent){
            progress += dt/2;
            progressBar.progress = progress;
        }
    },
    searchOpponent:function(){
        var netInstance = Network.getInstance();
        var tip=this.tip;
        
        var searchPre=cc.instantiate(this.searchPre);
        searchPre.setPosition(cc.p(0,0));
        this.node.addChild(searchPre,1,1000);
        
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
                    that.scheduleOnce(function(){
                        that.node.removeChildByTag(1000);
                        
                        //处理web版第一次加载对战场景慢的问题
                        var loading = cc.instantiate(this.loadingPrefab);
                        loading.setPosition(cc.p(0,50));
                        that.node.addChild(loading,1,2000);
                        
                        cc.director.loadScene('mirrorFight');
                        cc.audioEngine.stopMusic();
                    },(2000-delta)/1000);
                }
            }
        });
    },
    rank:function(){
        
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,50));
        this.node.addChild(loading,1,2000);
        cc.director.loadScene('rank');
        
    },
    fightRecord:function(){
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,50));
        this.node.addChild(loading,1,2000);
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
    quit:function(){
        cc.sys.localStorage.removeItem('isVolumeOpen');
        cc.sys.localStorage.removeItem('userid');
        cc.sys.localStorage.removeItem('token');
        cc.sys.localStorage.removeItem('isShowFightTip');
        cc.sys.localStorage.removeItem('username');
        cc.director.loadScene('login');
    },
});
