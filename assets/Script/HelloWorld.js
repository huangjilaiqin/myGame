cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        text: 'Hello, World',
        hande:{
            default:null,
            type:sp.Skeleton,
        }, 
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        cc.log(this.hande);
    },

    // called every frame
    update: function (dt) {

    },
}); 
