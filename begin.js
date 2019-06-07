let engine=require("MatchvsDemoEngine");
let GLB=require("Glb");
let msg=require("MatvhvsMessage");
let mvs=require("Matchvs");
cc.Class({
    extends: cc.Component,
    properties: {
        begin: cc.Node,
        paihang: cc.Node,
        introduce: cc.Node,
       
        
    },
    onLoad() {
        // 开始游戏
        this.begin.on('touchend', this.kaishi,this);
        // 排行榜
        this.paihang.on('touchend',this.kaishipai,this); 
        // 游戏介绍
        this.introduce.on('touchend',this.kaishiyouxi,this);
    },
    kaishi:function(){
        cc.director.loadScene('lobby');
        console.log(GLB.avatar);
    },
    kaishipai:function(){
        cc.director.loadScene("paihang");
    },
    kaishiyouxi:function(){
        cc.director.loadScene("introduce");
    },
});
