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
        var todayBegin = new Date(nowYear,nowMonth,nowDay);

        var time = new Date(Date.parse(timeStr));
        var oldYear = time.getFullYear();
        var oldMonth = time.getMonth();
        var oldDay = time.getDate();
        var oldHour = time.getHours();
        var oldMinute = time.getMinutes();
        var oldSecond = time.getSeconds();
        if(nowYear==oldYear && nowMonth==oldMonth && nowDay==oldDay){
            if(nowHour==oldHour){
                if(nowMinute==oldMinute){
                    if(nowSecond==oldSecond){
                        return '刚刚';
                    }else{
                        return (nowSecond-oldSecond)+"秒前";
                    }
                }else{
                    return (nowMinute-oldMinute)+"分钟前";
                }
            }else{
                var timeName = '';
                if(oldHour>=0 && oldHour<5){
                    timeName='凌晨';
                }else if(oldHour>=5 && oldHour<9){
                    timeName='早上';
                }else if(oldHour>=9 && oldHour<12){
                    timeName='上午';
                }else if(oldHour>=12 && oldHour<15){
                    timeName='中午';
                }else if(oldHour>=15 && oldHour<18){
                    timeName='下午';
                }else if(oldHour>=18 && oldHour<24){
                    timeName='晚上';
                }
                return timeName+" "+oldHour+":"+oldMinute;
            }
        }else if((todayBegin.getTime()-time.getTime())/3600000<=24){
            cc.log((time.getTime()-todayBegin.getTime())/3600000);
            cc.log(time);
            var timeName = '';
            if(oldHour>=0 && oldHour<5){
                timeName='凌晨';
            }else if(oldHour>=5 && oldHour<9){
                timeName='早上';
            }else if(oldHour>=9 && oldHour<12){
                timeName='上午';
            }else if(oldHour>=12 && oldHour<15){
                timeName='中午';
            }else if(oldHour>=15 && oldHour<18){
                timeName='下午';
            }else if(oldHour>=18 && oldHour<24){
                timeName='晚上';
            }
            if(oldMinute<10)
                oldMinute="0"+oldMinute;
            if(oldHour<10)
                oldHour="0"+oldHour;
            return "昨天 "+timeName+" "+oldHour+":"+oldMinute;
        }else{
            if(oldMinute<10)
                oldMinute="0"+oldMinute;
            if(oldHour<10)
                oldHour="0"+oldHour;
            return oldMonth+"月"+oldDay+"日 "+oldHour+":"+oldMinute;
        }
    },
    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
