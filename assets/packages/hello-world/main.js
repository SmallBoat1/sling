'use strict';
module.exports = {
    load()
    {
        console.log("加载扩展");
    },

    unload()
    {
        console.log("xiezai");
    },

    messages:{
        'say-hello'(){
            Editor.log("Hello world");
        }
    },
};