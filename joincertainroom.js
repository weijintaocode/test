let engine=require("MatchvsDemoEngine");
let GLB=require("Glb");
let msg=require("MatvhvsMessage");
let CornetMappingHost = GLB.platform === "release"? "http://vsopen.matchvs.com":"http://alphavsopen.matchvs.com";
let shortCreate = "/extra/shortCreate?"; // 短号生成
let shortQuery = "/extra/shortQuery?"; //短号还原
cc.Class({
    extends: cc.Component,
    properties: {
        match: cc.Node,
        back: cc.Node,
        nickName:cc.Label,
        roomID: {
            default: null,
            type: cc.EditBox
        },
        errorHint: {
            default: null,
            type: cc.Label
        }
    },
    onLoad () {
        let self = this;
        this.initEvent();
        self.nickName.string = '用户ID:'+GLB.userID;
        this.back.on('touchend',this.backa,this);
        this.match.on('touchend',this.matcha,this);
    },
    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent:function () {
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_ROOM_RSP,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_NETWORK_STATE_NOTIFY,this.onEvent,this);
    },
    /**
     * 接收事件
     * @param event
     */
    onEvent:function (event) {
        let eventData = event.data;
        if (event.type === msg.MATCHVS_ERROE_MSG) {
            if (eventData.errorCode === 405 ) {
                this.errorHint.node.active = true;
                this.errorHint.string = "房间已满";
                console.warn("房间已满");
                return;
            }
            if (eventData.errorCode === 406) {
                this.errorHint.node.active = true;
                this.errorHint.string = "房间已经关闭";
                console.warn("房间已joinOver");
                return;
            }
            cc.director.loadScene('lobby');
        } else if (event.type === msg.MATCHVS_JOIN_ROOM_RSP) {
           
            
                    cc.director.loadScene("lobby");
                
        
        } else if (event.type === msg.MATCHVS_NETWORK_STATE_NOTIFY) {
            if (eventData.netNotify.userID === GLB.userID && eventData.netNotify.state === 1) {
                console.log("netNotify.userID :"+eventData.netNotify.userID +"netNotify.state: "+eventData.netNotify.state);
                cc.director.loadScene("lobby");
            }
        }
    },
    /**
     * 移除监听
     */
    removeEvent:function () {
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_ROOM_RSP,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_NETWORK_STATE_NOTIFY,this.onEvent);
    },
    matcha:function(){
            let self = this;
            GLB.shortstr = self.roomID.string;
            let request = new XMLHttpRequest();
        let url = CornetMappingHost + shortQuery;
        url += "&userID="+GLB.userID+"&mode="+1+"&sign="+this.getShortQueryUserSign(GLB.token,GLB.appKey,GLB.gameID,self.roomID.string,GLB.userID);
        request.open("post",url , true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function () {
            if (request.readyState === 4 && (request.status >= 200 && request.status < 400)) {
                try{
                    let response = request.responseText;
                    let data = JSON.parse(response);
                    GLB.roomID=data.data.longstr;
                    let result = engine.prototype.joinRoom(data.data.longstr, "Matchvs");
                if (result === 0) {
                    self.errorHint.node.active = false;
                } else {
                    self.errorHint.node.active = true;
                    self.errorHint.string = "没有查找到此房间，请重新输入"
                }
                    
                    cc.director.loadScene("createroom");
                } catch(error){
                    console.warn(error.message);
                    
                }
            }
        };
        let jsonParam ={
            gameID:GLB.gameID,
            shortstr:GLB.shortstr,
        };
        request.send(JSON.stringify(jsonParam));
           
    },
    backa:function(){
        cc.director.loadScene("lobby");
    },
    onDestroy:function () {
        this.removeEvent();
        console.log("join certain Room 页面销毁");
    },
    
        
    
    getShortQueryUserSign:function(token,appKey,gameID,shortstr,userID) {
        let signStr;
        
         signStr = hex_md5(appKey+"&gameID="+gameID+"&shortstr="+shortstr+"&userID="+userID+"&"+token);
        
        return signStr;
    },
        
});
