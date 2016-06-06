cc.Class({
    extends: cc.Component,

    properties:{
        //个位数
        singleLabel:{
            default:null,
            type:cc.Label,
        },
        //十位数
        decadeLabel:{
            default:null,
            type:cc.Label,
        },
        score:0,
    },

    add:function(){
        this.score++;
        this.showScore();
    },
    showScore:function(){
        var single = Math.floor(this.score%10);
        var decade = Math.floor(this.score/10);
        this.singleLabel.string = single;
        this.decadeLabel.string = decade;
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
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
