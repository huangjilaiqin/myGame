cc.Class({
    extends: cc.Component,

    properties: {
        
        playerName:{
            default:null,
            type:cc.Label,
        },
        score:{
            default:null,
            type:cc.Label,
        },
        result:{
            default:null,
            type:cc.Label,
        },
        time:{
            default:null,
            type:cc.Label,
        },
    },
    
    init:function(record){
        this.playerName.string=record.opponentName;
        this.score.string=record.score;
        this.result.string=record.result;
        this.time.string=this.parseTime(record.time);
    },
    parseTime:function(timeStr){
        var now = new Date();
        var nowYear = now.getFullYear();
        var nowMonth = now.getMonth();
        var nowDay = now.getDate();
        var nowHour = now.getHours();
        var nowMinute = now.getMinutes();
        var nowSecond = now.getSeconds();
        var time = new Date(Date.parse(timeStr));
        var oldYear = time.getFullYear();
        var oldMonth = time.getMonth();
        var oldDay = time.getDate();
        var oldHour = time.getHours();
        var oldMinute = time.getMinutes();
        var oldSecond = time.getSeconds();
        cc.log(time);
        cc.log(oldYear);
        cc.log(oldMonth);
        cc.log(oldDay);
        cc.log(oldHour);
        cc.log(oldMinute);
        cc.log(oldSecond);
        if(nowYear==oldYear && nowMonth==oldMonth && nowDay==oldDay){
            if(nowHour==oldHour){
                if(nowMinute==oldMinute){
                    if(nowSecond==oldSecond){
                        return '刚才';
                    }else{
                        return (nowSecond-oldSecond)+"秒前";
                    }
                }else{
                    return (nowMinute-oldMinute)+"分钟前";
                }
            }else{
                return (nowHour-oldHour)+"小时前";
            }
        }else{
            return oldYear+"-"+oldMonth+"-"+oldDay+" "+oldHour+":"+oldMinute+":"+oldSecond;
        }
    },
    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
