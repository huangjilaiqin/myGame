
var globalsInfo = {
    kk:0,
    initGlobalListeners:function(netInstance){
        cc.log('initGlobalListeners');
        netInstance.listeneOn('verifyToken', function(result){
            if(result.error){
                cc.log("verifyToken: "+result.error);
                cc.director.loadScene('login');
            }else{
                cc.log('verifyToken success');
                //*
                globalsInfo.value=result.value;
                globalsInfo.total=result.total;
                globalsInfo.win=result.win;
                globalsInfo.draw=result.draw;
                globalsInfo.lost=result.lost;
                        
                globalsInfo.todaytask=result.todaytask;
                globalsInfo.todayamount=result.todayamount;
                globalsInfo.totalPercent=globalsInfo.todayamount/globalsInfo.todaytask;
                
                globalsInfo.remainhp=result.remainhp;
                globalsInfo.hp=result.hp;
                globalsInfo.hpPercent=globalsInfo.remainhp/globalsInfo.hp;
                //*/
                //tip=token;
                
            }
        });
    },
};

module.exports=globalsInfo;