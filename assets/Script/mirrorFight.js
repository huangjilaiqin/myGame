const Network = require('Network');
const globalsInfo = require('globalsInfo');

cc.Class({
    extends: cc.Component,
    
    properties: {
        myName:{
            default:null,
            type:cc.Label,
        },
        myScoreLabel:{
            default:null,
            type:cc.Label,
        },
        opponentScoreLabel:{
            default:null,
            type:cc.Label,
        },
        opponentName:{
            default:null,
            type:cc.Label,
        },
        countdown:{
            default:null,
            type:cc.Label,
        },
        myScore:0,
    },

    // use this for initialization
    onLoad: function () {
        cc.log(globalsInfo.opponent);
        var opponent = globalsInfo.opponent;
        this.opponentName.string=opponent.username;
        var myScore = this.myScore;
        var myScoreLabel = this.myScoreLabel;
        this.node.on(cc.Node.EventType.TOUCH_START,function(){
            
            myScore++;
            myScoreLabel.string=myScore;
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
