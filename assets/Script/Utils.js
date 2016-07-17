
var Utils={
    isEmpty:function (obj){
        for (var name in obj){
            return false;
        }
        return true;
    },
    cmpDate:function(date1,date2){
        var microsecond1 = date1.getTime();
        var microsecond2 = date2.getTime();
        if(microsecond1>microsecond2)
            return 1;
        else if(microsecond1<microsecond2)
            return -1;
        else
            return 0;
    }
};
module.exports=Utils;