const globalsInfo = require('globalsInfo');
const Network = require('Network');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        prefabRecordItem: cc.Prefab,
    },

    onLoad: function () {
        var that = this;
        this.content = this.scrollView.content;
        var netInstance = Network.getInstance();
        netInstance.emit('fightRecords', JSON.stringify({'userid':globalsInfo.userid,'token':globalsInfo.token}));
        
        netInstance.listeneOn('fightRecords', function(obj){
            cc.log('fightRecords',obj);
            var result = JSON.parse(obj);
            if(result.error){
                //提示
                cc.log("fightRecords: "+result.error);
            }else{
                that.populateList(result.datas);
            }
        });
        /*
        for (var i = 0; i < 10; i++) {
            var item = cc.instantiate(this.prefabRecordItem);
            var record={
                username:'唐三炮'+i,
                score:'23:19',
            };
            item.getComponent('fightItem').init(record);
            this.content.addChild(item);
        }
        */
    },

    populateList: function(rows) {
        var size = rows.length;
        for (var i = 0; i < size; i++) {
            var data = rows[i];
            var item = cc.instantiate(this.prefabRecordItem);
            var record={
                username:data['username'],
                score:data['uscore']+':'+data['oscore'],
            };
            item.getComponent('fightItem').init(record);
            this.content.addChild(item);
        }
    },
    back:function(){
        cc.director.loadScene('main');
    },
    fightRecords:function(){},
    beFightRecords:function(){
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
