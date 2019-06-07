
let GLB=require("Glb");
let engine=require("MatchvsDemoEngine");
let msg=require("MatvhvsMessage");
cc.Class({
    extends: cc.Component,
    properties: {
        confirm: cc.Button,
    },
    /**
     * load 显示页面
     */
    onLoad() {
        //engine.prototype.init(GLB.channel,GLB.platform);
        this.getUserOpenID();
        this.initEvent();
        let self = this;
        self.confirm.node.on('touchend', this.CreateUserInfoButton, this);
        //engine.prototype.init(GLB.channel,GLB.platform);
    },
    initEvent: function () {
        cc.systemEvent.on(msg.MATCHVS_INIT,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_LOGIN, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_REGISTER_USER, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_RE_CONNECT, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_WX_BINDING,this.onEvent,this);
    },
    onEvent: function (event) {
        let eventData = event.data;
        switch (event.type) {
            case msg.MATCHVS_INIT:
                console.log('weijinyao666');
                //this.getUserOpenID();
                this.getUserFromWeChat();
                console.log('为金涛');
                console.log(GLB.name);
               
            break;
            case msg.MATCHVS_REGISTER_USER:
                this.login(eventData.userInfo.id, eventData.userInfo.token);
                break;
            case msg.MATCHVS_LOGIN:
                if (eventData.MsLoginRsp.roomID != null && eventData.MsLoginRsp.roomID !== '0') {
                    console.log("开始重连" + eventData.MsLoginRsp.roomID);
                    engine.prototype.reconnect();
                } else {
                    cc.director.loadScene("loginlobby");
                }
                break;
            case msg.MATCHVS_RE_CONNECT:               
                GLB.roomID = eventData.roomUserInfoList.roomID;                
                if (eventData.roomUserInfoList.owner === GLB.userID) {                   
                    GLB.isRoomOwner = true;                
                } else {                    
                    GLB.isRoomOwner = false;                
                }                
                if (eventData.roomUserInfoList.state === 1) {                    
                    if (eventData.roomUserInfoList.roomProperty === "") {                        
                        engine.prototype.leaveRoom();                        
                        cc.director.loadScene("loginlobby");                    
                    } else  {                        
                        cc.director.loadScene('CreateRoom');                    
                    }                
                } else {                    
                    cc.director.loadScene("Game");                
                }                
                break;
            case msg.MATCHVS_ERROE_MSG:                
                console.log(eventData.errorCode);
                console.log(eventData.errorMsg);
                break;
            case msg.MATCHVS_WX_BINDING:
                engine.prototype.login(eventData.data.userid,eventData.data.token);
                break;

        }
    },
    /**
     * 登录
     * @param id
     * @param token
     */
    login: function (id, token) {
        GLB.userID = id;
        GLB.token=token;
        engine.prototype.login(id, token);
    },
    removeEvent: function () {
        cc.systemEvent.off(msg.MATCHVS_INIT,this.onEvent,this);
        cc.systemEvent.off(msg.MATCHVS_WX_BINDING,this.onEvent,this);
        cc.systemEvent.off(msg.MATCHVS_LOGIN, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_REGISTER_USER, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_RE_CONNECT, this.onEvent, this);
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
    },
    onDestroy() {
        this.removeEvent();
        console.log("Login页面销毁");
        console.log(GLB.userID);
        console.log(GLB.name);
        console.log(GLB.openid);
        console.log(GLB.session);
        

    },
    CreateUserInfoButton: function () {

        

        var sysInfo = window.wx.getSystemInfoSync();
        var left = (sysInfo.screenWidth / 2) - 100;
        var top = (sysInfo.screenHeight / 2) + 80;
        window.wx.getSetting({
            success (res) {
                console.log(res.authSetting);
                if (res.authSetting["scope.userInfo"]) {
                    console.log("用户已授权");
                   window.wx.getStorage({
                       key:"score",
                       success:function(res){
                           GLB.score=res.data;
                       },
                       fail:function(res){
                            console.log("fail");
                       }
                   });
                    engine.prototype.init(GLB.channel,GLB.platform);
                    window.wx.getUserInfo({
                        
                        lang: 'zh_CN',
                        success: function (res) {
                            GLB.name = res.userInfo.nickName;
                            GLB.avatar =res.userInfo.avatarUrl;
                            
                        },
                        fail: function (res) {
                            if (res.errMsg == "getUserInfo:fail scope unauthorized") {
                                console.warn("getWxUserInfo error");
                                
                            }
                            console.log("fail", res);
                            return "";
                        }
                    });
                }else {
                    console.log("用户未授权");
                    let button = window.wx.createUserInfoButton({
                        type: 'image',
                        image: '/.../pictures/pao.png',
                        style: {
                            left: left,
                            top: top,
                            width: 200,
                            height: 40,
                            backgroundColor: '#ff0000',
                            color: '#ffffff',
                            borderColor: "#ffffff",
                            borderWidth: 1,
                            borderRadius: 4,
                            textAlign: 'center',
                            fontSize: 16,
                            lineHeight: 4,
                        },
                        withCredentials: true
                    });
                    console.log('wangergou');
                    button.show();
                    button.onTap((res) => {
                        if (res.userInfo) {
                            console.log("用户授权:", res);
                                 
                                
                            engine.prototype.init(GLB.channel,GLB.platform);
                            
                            window.wx.getUserInfo({
                                
                                lang: 'zh_CN',
                                success: function (res) {
                                    GLB.name = res.userInfo.nickName;
                                    GLB.avatar =res.userInfo.avatarUrl;
                                    
                                },
                                fail: function (res) {
                                    if (res.errMsg == "getUserInfo:fail scope unauthorized") {
                                        console.warn("getWxUserInfo error");
                                       
                                    }
                                    console.log("fail", res);
                                    return "";
                                }
                            });
                            button.destroy();
                        }else {
                            console.log("用户拒绝授权:", res);
                        }
                    });
                    
                }
            }
        });
    },
    getUserFromWeChat: function () {

        try {
            console.log(GLB.openid);
            this.bindOpenIDWithUserID();
                
            
        } catch (error) {
            console.warn("getUserFromWeChat for error:" + error.message);
            console.log("不是在微信平台，调用不进行绑定！");
           
        }
    },
    getUserOpenID: function () {
        
        var mSecret='bce6410c5337d1e8cd95fcdc3e38eb99';
        var mAppid='wxca954466839f4cf2';
        window.wx.login({
            success: function (res) {
                var wcode = res.code;
                var mUrl = "https://api.weixin.qq.com/sns/jscode2session?appid="+mAppid+"&secret="+mSecret+"&js_code="+wcode+"&grant_type=authorization_code";
                //var mUrl="https://alphavsopen.matchvs.com/getOpenID?"
                window.wx.request({
                    url: mUrl,

                    method: "GET",
                    data: {
                        code: wcode
                    },
                    success: function (res) {
                        GLB.openid=res.data.openid;
                        GLB.session=res.data.session_key;
                       
                        console.log('8888888888');
                        console.log(GLB.openid);
                        console.log(res.data.openid);
                        console.log('8888888888');
                        console.log(GLB.session);
                        console.log(res.data.session_key);
                        console.log('888888888888');
                       
                    }
                });
            },
            fail: function (res) {
               

                console.log(res.data);
                
            },
        });
    },
    
    


    /**
     * 绑定微信OpenID 返回用户信息
     */
    bindOpenIDWithUserID: function () {
        let self = this;
        
        
        GLB.isWX = true;
        let req = new XMLHttpRequest();
        let reqUrl = this.getBindOpenIDAddr(GLB.channel, GLB.platform);
        req.open("post", reqUrl, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = function () {
            if (req.readyState === 4 && (req.status >= 200 && req.status < 400)) {
                try {
                    let response = req.responseText;
                    let data = JSON.parse(response).data;
                    console.log(data.userid, data.token);
                    
                    self.login(data.userid, data.token);
                } catch (error) {
                    console.warn(error.message);
                    
                }
            }
        };
        let params = "gameID=" + GLB.gameID + "&openID=" + GLB.openid + "&session=" + GLB.session + "&thirdFlag=1";
        //计算签名
        let signstr = this.getSign(params);

        let jsonParam = {
            userID: 0,
            gameID: GLB.gameID,
            openID: GLB.openid,
            session: GLB.session,
            thirdFlag: 1,
            sign: signstr
        };
        console.log('99999999999');
        console.log(jsonParam.openID);
        console.log(GLB.openid);
        console.log(jsonParam.session);
        console.log(GLB.session);
        console.log(jsonParam.sign);
        req.send(JSON.stringify(jsonParam));

    },

    getBindOpenIDAddr: function (channel, platform) {
        if (channel === "MatchVS" || channel === "Matchvs") {
            if (platform === "release") {
                return "https://vsopen.matchvs.com/wc6/thirdBind.do?"
            } else if (platform === "alpha") {
                return "https://alphavsopen.matchvs.com/wc6/thirdBind.do?";
            }
        } else if (channel === "MatchVS-Test1") {
            if (platform === "release") {
                return "https://vsopen.matchvs.com"
            } else if (platform === "alpha") {
                return "https://alphavsopen.matchvs.com";
            }
        }
    },

    getSign: function (params) {
        let str = GLB.appKey + "&" + params + "&" + GLB.secret;
        console.log(str);
        let md5Str = hex_md5(str);
        console.log(md5Str);
        return md5Str;
    },
});