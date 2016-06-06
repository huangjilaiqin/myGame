cc.Class({
    extends: cc.Component,

    properties:{
        //分数
        scoreLabel:{
            default:null,
            type:cc.Label,
        },
        score:0,
        records:[],
        lastTime:null,
    },

    add:function(){
        this.score++;
        this.showScore();
        
        var currentTime=new Date().getTime();
        this.records.push((currentTime-this.lastTime)/1000);
        this.lastTime=currentTime;
    },
    getRecords:function(){
        return this.records;
    },
    showScore:function(){
        this.scoreLabel.string = this.score;
    },
    setScore:function(score){
        this.score=score;
    },
    getScore:function(){
        return this.score;
    },
    // use this for initialization
    onLoad: function () {
        this.showScore();
        this.lastTime = new Date().getTime();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
