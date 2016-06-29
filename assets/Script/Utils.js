
var Utils={
    isEmpty:function (obj){
        for (var name in obj){
            return false;
        }
        return true;
    },

};
module.exports=Utils;