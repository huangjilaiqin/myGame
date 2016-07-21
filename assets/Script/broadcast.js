const globalsInfo = require('globalsInfo');

cc.Class({
    extends: cc.Component,

    properties: {
        msg:{
            default:null,
            type:cc.Label,
        },
        bg:{
            default:null,
            type:cc.Sprite,
        },
        myx:{
            default:null,
        },
        datas:{
            default:null,
            visible:false,
        },
        clearDatasCb:{
            default:null,
            visible:false,
        },
        currentIndex:{
            default:0,
            visible:false,
        },
        haveInitMsg:{
            default:false,
            visible:false,
        },
        typeName:{
            default:null,
            visible:false,
        },
    },
    init:function(typeName,datas,clearDatasCb){
        this.typeName=typeName;
        this.datas=datas;
        this.clearDatasCb=clearDatasCb;
    },
    // use this for initialization
    onLoad: function () {
        this.halfScreenWidth = cc.winSize.width/2;
        
        //该字段用于指示这个广播当前的播放位置
        if(globalsInfo[this.typeName]===undefined)
            globalsInfo[this.typeName]=0;
        cc.log('broadcast onLoad',this.datas.length);
        if(this.datas.length>0){
            this.initMsg();
        }
    },
    initMsg:function(){
        this.msg.string = this.datas[globalsInfo[this.typeName]].msg;
        this.myx=this.halfScreenWidth;
        this.node.setPosition(cc.p(this.myx,550));
        this.bg.node.height=this.msg.node.height+32;
        this.bg.node.width=this.msg.node.width+32;
        this.haveInitMsg=true;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.datas.length>0){
            if(!this.haveInitMsg){
                this.initMsg();
            }
            this.myx-=dt*100;
            //this.myx-=2.5;
            
            var minV = -this.halfScreenWidth-this.bg.node.width;
            if(this.myx<=minV){
                globalsInfo[this.typeName]++;
                globalsInfo[this.typeName]=globalsInfo[this.typeName]%this.datas.length;
                //对广播进行清理,去除掉过期广播
                if(globalsInfo[this.typeName]===0 && this.clearDatasCb){
                    this.clearDatasCb(this.datas);
                    if(this.datas.length===0)
                        return;
                }
                
                this.myx=this.halfScreenWidth;
                this.msg.string = this.datas[globalsInfo[this.typeName]].msg;
                this.bg.node.height=this.msg.node.height+32;
                this.bg.node.width=this.msg.node.width+32;
            }
            this.node.setPosition(cc.p(this.myx,550));
        }
    },
});
