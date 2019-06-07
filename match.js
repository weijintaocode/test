let engine=require("MatchvsDemoEngine");
let GLB=require("Glb");
let msg=require("MatvhvsMessage");
let mvs=require("Matchvs");
cc.Class({
    extends: cc.Component,
    properties: {
        playerNameOne: {
            default: null,
            type: cc.Label
        },
        playerNameTwo: {
            default: null,
            type: cc.Label
        },
        
        
        
        labelRoomID: {
            default: null,
            type: cc.Label
        },
        
        
        
        back: cc.Node,
        
        
    },
    onLoad() {
        
        this.initEvent();
       
        
       
        engine.prototype.joinRandomRoom(GLB.MAX_PLAYER_COUNT, "随机匹配");
        this.back.on(cc.Node.EventType.TOUCH_END, function () {
            GLB.roomID = "";
            engine.prototype.leaveRoom();
        });
        
    },
    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent:function () {
        cc.systemEvent.on(msg.MATCHVS_SEND_EVENT_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_ROOM_RSP,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_OPEN_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_OPEN_RSP,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_OVER_RSP,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_OVER_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_KICK_PLAYER,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_KICK_PLAYER_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_NETWORK_STATE_NOTIFY,this.onEvent,this);
    },
    /**
     * 事件接收方法
     * @param event
     */
    onEvent:function (event) {
        let eventData = event.data;
        
        switch (event.type) {
            case msg.MATCHVS_SEND_EVENT_NOTIFY:
            let data = JSON.parse(eventData.eventInfo.cpProto);
            if(this.playerNameTwo.string==''){
                this.playerNameTwo.string=data;
                this.startGame();
            }
            break;
            case msg.MATCHVS_JOIN_ROOM_RSP:
                this.joinRoom(eventData.userInfoList);
                break;
            case msg.MATCHVS_JOIN_ROOM_NOTIFY:
                
                this.initUserView(eventData.roomUserInfo);
                break;
            case msg.MATCHVS_LEAVE_ROOM:
                cc.director.loadScene('Lobby');
                break;
            case msg.MATCHVS_LEAVE_ROOM_NOTIFY:
                this.removeView(eventData.leaveRoomInfo);
                break;
            case msg.MATCHVS_JOIN_OVER_NOTIFY:
               
                console.log("关闭");
                break;
            case msg.MATCHVS_JOIN_OVER_RSP:
                
                console.log("关闭");
                break;
            case msg.MATCHVS_JOIN_OPEN_RSP:
                
                console.log("打开");
                break;
            case msg.MATCHVS_JOIN_OPEN_NOTIFY:
                
                console.log("打开");
                break;
            case msg.MATCHVS_ERROE_MSG:
                GLB.roomID = "";
                if (eventData.errorCode !== 400) {
                    cc.director.loadScene('Login');
                }
                break;
            case msg.MATCHVS_KICK_PLAYER:
                this.removeView(eventData.kickPlayerRsp);
                break;
            case msg.MATCHVS_KICK_PLAYER_NOTIFY:
                this.removeView(eventData.kickPlayerNotify);
                break;
            case msg.MATCHVS_NETWORK_STATE_NOTIFY:
                if (eventData.netNotify.state === 1) {
                    engine.prototype.kickPlayer(eventData.netNotify.userID,"你断线了，被提出房间");
                }
                break;
        }
    },
    /**
     * 生命周期，页面销毁
     */
    onDestroy:function () {
        this.removeEvent();
        console.log("Match页面销毁");
    },
    /**
     * 取消事件监听
     */
    removeEvent:function () {
        cc.systemEvent.off(msg.MATCHVS_SEND_EVENT_NOTIFY,this.onEvent,this);
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_ROOM_RSP,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_OPEN_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_OPEN_RSP,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_OVER_RSP,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_OVER_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_KICK_PLAYER,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_KICK_PLAYER_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_NETWORK_STATE_NOTIFY,this.onEvent);
    },
    /**
     * 进入房间业务逻辑
     * @param userInfoList
     */
    joinRoom: function (userInfoList) {
        this.labelRoomID.string = userInfoList.roomID;
        GLB.roomID = userInfoList.roomID;
        this.playerNameOne.string = GLB.name;
        if(this.playerNameTwo.string!=''&&this.playerNameOne.string!=''){
            console.log(this.playerNameOne.string);
            console.log(this.playerNameTwo.string);
            console.log('55555555555');
            this.startGame();
        engine.prototype.joinOver();
               
        }
    },
    /**
     * 展示玩家信息
     * @param userList
     */
    initUserView :function(userList){
        
            let info = JSON.parse(userList.userProfile);
            
                this.playerNameTwo.string = info.name;
                engine.prototype.sendEventEx(0,JSON.stringify(this.playerNameOne.string));
                
               
            
        
        if(this.playerNameOne.string!=''&&this.playerNameTwo.string!=''){
            console.log(this.playerNameOne.string);
            console.log(this.playerNameTwo.string);
            console.log('7777777777');
            engine.prototype.joinOver();
            GLB.isRoomOwner=true;
                    GLB.begin=true;
                    this.startGame();
            /*GLB.A=parseInt(Math.random()*10000);
            console.log(GLB.A);
            let event = {
                action: msg.MATCHVS_A,
                info:GLB.A,
            };
            engine.prototype.sendEventEx(0,JSON.stringify(event));
            */
        }
    },
    /**
     * 玩家退出将玩家的信息从页面上消失
     * @param info
     */
    /*removeView:function (info) {
        
            if(info.userID === this.this.playerTwoLabel.string) {
                
                this.playerNameOne.string = "";
                
                
            }else{
                this.playerNameTwo.string = "";
                
            }
        
    },
    */ 
    startGame: function () {
        cc.director.loadScene('game');
    },
});