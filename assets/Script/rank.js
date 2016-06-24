const globalsInfo = require('globalsInfo');
const Network = require('Network');
cc.Class({
    extends: cc.Component,
    properties: {
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab,
        loadingPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad: function () {
                
        var loading = cc.instantiate(this.loadingPrefab);
        loading.setPosition(cc.p(0,0));
        this.node.addChild(loading,1,2000);
        
        var that = this;
        this.content = this.scrollView.content;
        var netInstance = Network.getInstance();
        netInstance.emit('rank', {});
        netInstance.listeneOn('rank', function(obj){
            that.node.removeChildByTag(2000);
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("rank error: "+result);
            }else{
                that.populateList(result.rank);
            }
        });
    },

    populateList: function(rows) {
        cc.log('populateList');
        var size = rows.length;
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
