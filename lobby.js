let engine = require("MatchvsDemoEngine");
let GLB = require("Glb");
let msg = require("MatvhvsMessage");
let mvs = require("Matchvs");
let CornetMappingHost = GLB.platform === "release"? "http://vsopen.matchvs.com":"http://alphavsopen.matchvs.com";
let shortCreate = "/extra/shortCreate?"; // 短号生成
let shortQuery = "/extra/shortQuery?"; //短号还原

cc.Class({
    extends: cc.Component,
    properties: {
        randomMatch: cc.Node,
        joinCertainRoom: cc.Node,
        createRoom: cc.Node,

        nickName: cc.Label,

    },
    onLoad() {
        this.initEvent();

        this.nickName.string = "用户ID：" + GLB.name;

        // 随机匹配
        this.randomMatch.on('touchend', this.suigipipei, this);
        // 加入指定房间
        this.joinCertainRoom.on('touchend', this.jiaruzhidingfangjian, this);
        // 创建房间
        this.createRoom.on('touchend', this.chuangjianfangjian, this);

    },
    suigipipei: function () {
        GLB.matchType = GLB.RANDOM_MATCH; // 修改匹配方式为随机匹配
        cc.director.loadScene('match');
        //cc.director.loadScene('createroom');
    },
    chuangjianfangjian: function () {
        let create = new mvs.MsCreateRoomInfo();
        create.name = 'roomName';
        create.maxPlayer = GLB.MAX_PLAYER_COUNT;
        create.mode = 0;
        create.canWatch = 0;
        create.visibility = 1;
        engine.prototype.createRoom(create, "Matchvs");

    },
    jiaruzhidingfangjian: function () {
        console.log('weijintao');
        cc.director.loadScene("joincertainroom");
    },


    initEvent() {
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_CREATE_ROOM, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent, this);
    },


    /**     * 接收事件     * @param event     */
    onEvent(event) {
        let eventData = event.data;
        if (event.type === msg.MATCHVS_ERROE_MSG) {
            cc.director.loadScene('Login');
        } else if (event.type === msg.MATCHVS_CREATE_ROOM) {
            GLB.roomID = eventData.rsp.roomID;
           
            let request = new XMLHttpRequest();
            let url = CornetMappingHost + shortCreate;
            url += "&userID="+GLB.userID+"&mode="+1+"&sign="+this.getShortCreateUserSign(GLB.token,GLB.appKey,600,GLB.gameID,GLB.roomID,GLB.userID);
            request.open("post",url , true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = function () {
                if (request.readyState === 4 && (request.status >= 200 && request.status < 400)) {
                    try{
                        let response = request.responseText;
                        let data = JSON.parse(response);
                       
                        console.log('0000000000000000000000000000');
                        console.log(data);
                       console.log(GLB.roomID);
                       console.log(data.data.shortstr);
                      GLB.shortstr = data.data.shortstr;
                      cc.director.loadScene('createroom');
                    } catch(error){
                        console.warn(error.message);
                        
                    }
                }
            };
            let jsonParam ={
                gameID:GLB.gameID,
                longstr:GLB.roomID,
                expire:600,
                length:6,
            };
            request.send(JSON.stringify(jsonParam));
            
            GLB.isRoomOwner=true;
            GLB.begin=true;
            
        } else if (event.type === msg.MATCHVS_NETWORK_STATE_NOTIFY) {
            if (eventData.netNotify.userID === GLB.userID && eventData.netNotify.state === 1) {
                console.log("netNotify.userID :" + eventData.netNotify.userID + "netNotify.state: " + eventData.netNotify.state);
                cc.director.loadScene("Login");
            }
        }
    },
    /**     * 移除监听     */
    removeEvent() {
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_CREATE_ROOM, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent);
    },

    getShortCreateUserSign:function(token,appKey,expire,gameID,longstr,userID) {
        
        let signStr = hex_md5(appKey+"&expire="+expire+"&gameID="+gameID+"&longstr="+longstr+"&userID="+userID+"&"+token);
       
        return signStr;
    },

    onDestroy: function () { this.removeEvent(); console.log("Lobby页面销毁"); }
});


