
const Network = require('Network');
const globalsInfo = require('globalsInfo');
const config = require('config');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        var userid;
        if (!cc.sys.isNative) {
            cc.log('main onLoad',location);
            if(location.search.length===0){
                cc.log('search is undefined');
            }
        }
        var that = this;
        var netInstance = Network.getInstance(config.serverIp,config.serverPort,function(){
            netInstance.emit('record', {'recordid':recordid});
            netInstance.listeneOn('record',function(obj){
                var result = JSON.parse(obj);
                var opponentName = result.username;
                var opponentRecord = result.record;
            });
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
