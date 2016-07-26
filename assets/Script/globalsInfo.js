
var globalsInfo = {
    worldMessges:[],
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
        
        netInstance.listeneOn('worldMessage', function(result){
            if(result.error){
                cc.log("worldMessage: "+result.error);
            }else{
                cc.log('worldMessage receive');
                
                if(globalsInfo.worldMessges===undefined){
                    globalsInfo.worldMessges=[];
                }
                var msgs = globalsInfo.worldMessges;
                var newMsg = result.msg;
                for(var i=0;i<msgs.length;){
                    var msg = msgs[i];
                    if(msg.userid===newMsg.userid && msg.type===newMsg.type){
                        msgs.splice(i,1);
                    }else{
                        i++;
                    }
                }
                globalsInfo.worldMessges.push(result.msg);
            }
        });
    },
    /*
    1:蒲公英,
    2:360应用市场,
    3:web,
    4:百度手机助手，
    5:91,
    6:安卓市场,
    7:木蚂蚁,
    8:应用宝,
    9:小米,
    */
    comefrom:9,
    /*
    1:Android,
    2:iOS,
    3:web,
    */
    platform:1,
};

module.exports=globalsInfo;