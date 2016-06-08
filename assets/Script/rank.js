const globalsInfo = require('globalsInfo');
const Network = require('Network');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab,
    },

    onLoad: function () {
        var that = this;
        this.content = this.scrollView.content;
        var netInstance = Network.getInstance();
        netInstance.emit('rank', JSON.stringify({'userid':globalsInfo.userid,'token':globalsInfo.token}));
        
        netInstance.listeneOn('rank', function(obj){
            cc.log(obj);
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("rank: "+result.error);
            }else{
                cc.log('rank success');
                that.populateList(result.rank);
            }
        });
        
    },

    populateList: function(rows) {
        var size = rows.length;
        for (var i = 0; i < size; i++) {
            var data = rows[i];
            var item = cc.instantiate(this.prefabRankItem);
            item.getComponent('rankItem').init(data['username']);
            this.content.addChild(item);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
