let engine=require("MatchvsDemoEngine");
let GLB=require("Glb");
let msg=require("MatvhvsMessage");
let mvs=require("Matchvs");

cc.Class({
    extends: cc.Component,

    properties: {
       leaveroom:cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.wx.setUserCloudStorage({
            KVDataList:[{key:"score",value: GLB.score.toString(2)},{key:"username",value:GLB.name}],
            success: function (res) {
                console.log("getUserCloudStorage 成功");   
            },
            fail: function (res) {
                console.log("getUserCloudStorage 失败");  
            }
        });
        window.wx.setStorage({
            key:"score",
            data: GLB.score.toString(2),
            success: function (res) {
                console.log("setStorage 成功");   
            },
            fail: function (res) {
                console.log("setStorage 失败");  
            }
        });
        let self=this;
        self.leaveroom.node.on('touchend',this.fanhui,this);
    },
    fanhui:function(){
        cc.director.loadScene('loginlobby'); 
    },
    start () {

    },

    // update (dt) {},
});
