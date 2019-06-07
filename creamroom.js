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

        btnStartGame:cc.Node,
        
    },
    onLoad() {

       
        this.initEvent();
        this.buttonIsshow(GLB.isRoomOwner);
       this.labelRoomID.string=GLB.shortstr;
        this.playerNameOne.string = GLB.name;
        
        this.back.on('touchend',this.backa,this);             
        this.btnStartGame.on('touchend',this.begina,this);        
                    
        
        
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
            if(data.action=="screen"&&this.playerNameTwo.string==''){
                this.playerNameTwo.string=data.info;
               console.log('444444444444444444444444444');
            }
            if(data.action==msg.MATCHVS_SEND_EVENT_NOTIFY){
                this.startGame();
            }
            break;
            case msg.MATCHVS_JOIN_ROOM_RSP:
                //this.joinRoom(eventData.userInfoList);
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

    getShortCreateUserSign:function(token,appKey,expire,gameID,longstr,userID) {
        
        let signStr = hex_md5(appKey+"&expire="+expire+"&gameID="+gameID+"&longstr="+longstr+"&userID="+userID+"&"+token);
       
        return signStr;
    },
    

    /**
     * 进入房间业务逻辑
     * @param userInfoList
     */
   
    /**
     * 展示玩家信息
     * @param userList
     */
    initUserView :function(userList){
        
            let info = JSON.parse(userList.userProfile);
            
                this.playerNameTwo.string = info.name;
                let a={
                    action:'screen',
                    info:GLB.name,
                }
                engine.prototype.sendEventEx(0,JSON.stringify(a));
                
               
            
        
        
    },
    backa:function(){
        GLB.isRoomOwner=false;
        GLB.begin=false;
        engine.prototype.leaveRoom("");           
        this.leaveRoom1(); 
    },
    begina:function(){
        if (this.playerNameTwo.string!=''&&this.playerNameOne.string!='') {           
            let event = {                  
                  action: msg.MATCHVS_SEND_EVENT_NOTIFY,        
            };                
            engine.prototype.sendEventEx(0,JSON.stringify(event));    
            engine.prototype.joinOver();     
        } else {        
            console.log('房间人数小于' + GLB.MAX_PLAYER_COUNT); 
        }        
    },
    buttonIsshow:function(isshow){
        if(isshow==true){
            this.btnStartGame.active=true;
        }else {
            this.btnStartGame.active=false;
        }
    },
   leaveRoom1:function(){
       GLB.roomID="";
       cc.director.loadScene('loginlobby');
   },
    startGame: function () {
        cc.director.loadScene('game');
    },
});