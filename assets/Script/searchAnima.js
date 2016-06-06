cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.getComponent(cc.Sprite);
        this.anim.play('search');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
