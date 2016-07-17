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
    },
    init:function(datas,clearDatasCb){
        this.datas=datas;
        this.clearDatasCb=clearDatasCb;
    },
    // use this for initialization
    onLoad: function () {
        this.halfScreenWidth = cc.winSize.width/2;
        cc.log('broadcast onLoad',this.datas.length);
        if(this.datas.length>0){
            this.initMsg();
        }
    },
    initMsg:function(){
        this.msg.string = this.datas[this.currentIndex].msg;
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
            
            this.myx-=dt*150;
            
            var minV = -this.halfScreenWidth-this.bg.node.width;
            if(this.myx<=minV){
                this.currentIndex++;
                this.currentIndex=this.currentIndex%this.datas.length;
                if(this.currentIndex===0 && this.clearDatasCb){
                    this.clearDatasCb(this.datas);
                    if(this.datas.length===0)
                        return;
                }
                
                this.myx=this.halfScreenWidth;
                this.msg.string = this.datas[this.currentIndex].msg;
                this.bg.node.height=this.msg.node.height+32;
                this.bg.node.width=this.msg.node.width+32;
            }
            this.node.setPosition(cc.p(this.myx,550));
        }
    },
});
