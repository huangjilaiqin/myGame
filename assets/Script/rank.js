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
        cc.log(this.name);
        var that = this;
        this.content = this.scrollView.content;
        var cbs = {
            onNotValid:function(){},
        };
        var netInstance = Network.getInstance();
        cc.log('netInstance id' ,netInstance.id);
        netInstance.emit('ranktest', {});
        netInstance.emit('rank', {});
        netInstance.onOneEventOneFunc('rank', function(obj){
            that.node.removeChildByTag(2000);
            if(obj.error){
                //提示
                cc.log("rank error: "+obj);
            }else{
                that.populateList(obj.rank);
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
