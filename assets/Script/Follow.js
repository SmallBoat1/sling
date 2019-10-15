cc.Class({
    extends: cc.Component,

    properties: {
        hero:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad:function () {
         this.node.runAction(cc.follow(this.hero));
     },
});
