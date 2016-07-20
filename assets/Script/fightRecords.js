const globalsInfo = require('globalsInfo');
const Network = require('Network');
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        prefabRecordItem: cc.Prefab,
        loadingPrefab: {
            default: null,
            type: cc.Prefab
        },
        fightBt:{
            default:null,
            type:cc.Button,
        },
        beFightBt:{
            default:null,
            type:cc.Button,
        },
        netInstance:{
            default:null,
            visible:false,
        },
        onFightRecords:{
            default:null,
            visible:false,
        },
        onBeFightRecords:{
            default:null,
            visible:false,
        },
    },

    onLoad: function () {
        window.scenename='fightRecords';
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        
        this.fightBt.interactable=false;
        
        var that = this;
        this.content = this.scrollView.content;
        
        this.onFightRecords = function(result){
            cc.log('onFightRecords');
            
            if(that.fightBt.interactable)
                return;
            that.node.removeChildByTag(2000);
            //var result = JSON.parse(obj);
            cc.log(result);
            if(result.error){
                //提示
                cc.log("fightRecords: "+result.error);
            }else{
                that.fightList(result.datas);
            }
        };
        this.onBeFightRecords = function(result){
            cc.log('onBeFightRecords');
            if(that.beFightBt.interactable)
                return;
            that.node.removeChildByTag(2000);
            //var result = JSON.parse(obj);
            cc.log(result);
            if(result.error){
                //提示
                cc.log("beFightRecords: "+result.error);
            }else{
                that.beFightList(result.datas);
            }
        };
        this.netInstance = Network.getInstance();
        this.netInstance.onOneEventOneFunc('fightRecords', this.onFightRecords);
        
        this.netInstance.emit('fightRecords', {});
    },

    fightList: function(rows) {
        var size = rows.length;
        for (var i = 0; i < size; i++) {
            var data = rows[i];
            var item = cc.instantiate(this.prefabRecordItem);
            var record={
                opponentName:data.username,
                score:data.uscore+":"+data.oscore,
                result:this.getResultTip(data.uscore,data.oscore),
                time:data.fighttime,
            };
            item.getComponent('fightItem').init(record);
            this.content.addChild(item);
        }
    },
    beFightList: function(rows) {
        var size = rows.length;
        for (var i = 0; i < size; i++) {
            var data = rows[i];
            var item = cc.instantiate(this.prefabRecordItem);
            var record={
                opponentName:data.username,
                score:data.oscore+":"+data.uscore,
                result:this.getResultTip(data.oscore,data.uscore),
                time:data.fighttime,
            };
            item.getComponent('fightItem').init(record);
            this.content.addChild(item);
        }
    },
    getResultTip:function(scorea,scoreb){
        var delta=0;
        if(scorea>scoreb){
            delta = scorea-scoreb;
            if(delta<=3){
                return '险胜';
            }else if(delta/scoreb>=0.5){
                return '完勝';
            }else{
                return '胜';
            }
        }else if (scorea<scoreb){
            delta = scoreb-scorea;
            if(delta<=3){
                return '惜败';
            }else if(delta/scoreb>=0.5){
                return '惨败';
            }else{
                return '败';
            }
        }else{
            return '平';
        }
    },
    back:function(){
        cc.director.loadScene('main');
    },
    fightRecords:function(){
        //按钮状态切换
        this.fightBt.interactable=false;
        this.beFightBt.interactable=true;
        //清楚列表数据
        this.content.removeAllChildren();
        this.scrollView.scrollToTop();
        this.node.removeChildByTag(2000);
        //转圈圈
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        //请求数据
        
        this.netInstance.emit('fightRecords', {});
        this.netInstance.onOneEventOneFunc('fightRecords', this.onFightRecords);
        
    },
    beFightRecords:function(){
        this.beFightBt.interactable=false;
        this.fightBt.interactable=true;
        //清楚列表数据
        this.content.removeAllChildren();
        this.scrollView.scrollToTop();
        this.node.removeChildByTag(2000);
        //转圈圈
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        //请求数据
        
        this.netInstance.emit('beFightRecords', {});
        this.netInstance.onOneEventOneFunc('beFightRecords', this.onBeFightRecords);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
