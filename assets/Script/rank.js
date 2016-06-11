const globalsInfo = require('globalsInfo');
const Network = require('Network');
//var that;
cc.Class({
    extends: cc.Component,
    properties: {
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab,
        myname:'huangji',
    },

    onLoad: function () {
        //把that写成局部的多次加在这个场景 populateList里面的this会跟这个that不一样
        //写到外面有变成全局的了
        var that = this;
        globalsInfo.mythis = this;
        this.content = this.scrollView.content;
        var netInstance = Network.getInstance();
        netInstance.emit('rank', JSON.stringify({'userid':globalsInfo.userid,'token':globalsInfo.token}));
        var rankCallback = function foo(obj){
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("rank: "+result.error);
            }else{
                cc.log('rank success',that);
                that.populateList(result.rank);
            }
        };
        if(globalsInfo.kk===0 || 1){
            netInstance.listeneOn('rank',rankCallback);
            globalsInfo.kk=1;
        }
        /*
        netInstance.listeneOn('rank', function(obj){
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("rank: "+result.error);
            }else{
                cc.log('rank success',that);
                that.populateList(result.rank);
            }
        });
        */
    },

    populateList: function(rows) {
        cc.log('populateList');
        var size = rows.length;
        if(globalsInfo.mythis==this)
            cc.log('this is equal');
        else
            cc.log('this is not equal');
        this.content.removeAllChildren();
        for (var i = 0; i < size; i++) {
            var data = rows[i];
            var item = cc.instantiate(this.prefabRankItem);
            
            var player={
                'rank':i+1,
                'name':data.username,
                'total':data.total,
            };
            item.getComponent('rankItem').init(player);
            
            this.content.addChild(item);
        }
    },
    back:function(){
        cc.director.loadScene('main');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
