let engine=require("MatchvsDemoEngine");
let GLB=require("Glb");
let msg=require("MatvhvsMessage");


cc.Class({
    extends: cc.Component,
    properties: {
        bing: cc.Prefab,
        pao: cc.Prefab,
        tubiao: cc.Prefab,
        shuzu:[],
        jishi:cc.Label,
    },
    onLoad() {
        
       /* this.timer=null;
       
        let self=this;
        this.jishi.string=30;
        if(GLB.isRoomOwner==true){
	        this.timer=setInterval(function(){
                self.jishi.string=self.jishi.string-1;
            },1000);
        }*/

        this.initEvent();
       
        this.chessboarrd = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0,], [0, 0, 0, 0, 0]]
        this.r = 0;
        this.t = 0;
        let windowSize = cc.view.getVisibleSize();
        
        this.A_width = windowSize.width;
        this.henghang = 6;
        this.LongX = parseInt(this.A_width / this.henghang);
        if (GLB.isRoomOwner == true) {
            this.enemyPool = new cc.NodePool();
        var initCount = 15;
        for (var i = 0; i < initCount; i++) {
            var enemy = cc.instantiate(this.bing);
            this.enemyPool.put(enemy);
        }
        for (var i = 0; i < initCount; i++) {
            var enemy = this.enemyPool.get();
            enemy.index = 1;
            this.node.addChild(enemy);
            enemy.y = (2 - parseInt(i / 5)) * this.LongX;
            enemy.x = (i % 5 - 2) * this.LongX;
        }
        this.woPool = new cc.NodePool();
        var Count = 3;
        for (var i = 0; i < Count; i++) {
            var enemy = cc.instantiate(this.pao);
            this.woPool.put(enemy);
        }
        for (var i = 0; i < Count; i++) {
            var enemy = this.woPool.get();
            enemy.index = 2;
            this.node.addChild(enemy);
            enemy.y = -2 * this.LongX;
            enemy.x = (-1 + i) * this.LongX;
        }
        this.chessboarrd = [[1,1,1,0,0], [1,1,1,0,2], [1,1,1,0,2], [1,1,1,0,2], [1,1,1,0,0]];
            
        } else {
            this.woPool = new cc.NodePool();
        var Count = 3;
        for (var i = 0; i < Count; i++) {
            var enemy = cc.instantiate(this.pao);
            this.woPool.put(enemy);
        }
        for (var i = 0; i < Count; i++) {
            var enemy = this.woPool.get();
            enemy.index = 2;
            this.node.addChild(enemy);
            enemy.y = 2 * this.LongX;
            enemy.x = (-1 + i) * this.LongX;
        }
        this.enemyPool = new cc.NodePool();
        var initCount = 15;
        for (var i = 0; i < initCount; i++) {
            var enemy = cc.instantiate(this.bing);
            this.enemyPool.put(enemy);
        }
        for (var i = 0; i < initCount; i++) {
            var enemy = this.enemyPool.get();
            enemy.index = 1;
            this.node.addChild(enemy);
            enemy.y = (parseInt(i / 5) - 2) * this.LongX;
            enemy.x = (i % 5 - 2) * this.LongX;
        }
        this.chessboarrd = [[0, 0, 1,1,1], [2,0,1,1,1], [2,0,1,1,1], [2,0,1,1,1], [0,0,1,1,1]];
        }
        
        this.node.on('touchstart', this.touchEvent, this);
    },
    touchEvent(event) {
        if (GLB.begin == false) return "";
        //this.timer=setInterval(this.countDown(),1000);
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        var pos_x = parseInt(pos.x / (this.LongX / 2));
        var pos_y = parseInt(pos.y / (this.LongX / 2));
        var posx=this.shujuzhuanhuan(pos_x);
        var posy=this.shujuzhuanhuan(pos_y);
        console.log(posx);
        console.log(posy);
        //location为判断是否为空
        var location = this.suanIsEmpty(posx, posy);
        //fangkuang为是否有标志
        
        for (var i = 0; i < this.node.childrenCount; i++) {
            var q = this.node.children[i];
            if (q.index == 20) {
                var fangkuang = true;
            }else{
                fangkuang=false;
            }
        }
        if (location == false) {
            if (fangkuang == false) {
                console.log('77777777777');
                
            } else {
                for (var i = 0; i < this.node.childrenCount; i++) {
                    var q = this.node.children[i];
                    if (q.index == 20) {
                        
                        if (this.isCanGo(q.x,q.y, posx, posy) == true) {
                            this.TheFirstGo(q.x,q.y, posx, posy);
                            
                        } else {
                            console.log('8888888888888888');
                           
                        }
                    }
                }
               
            }
        } else {
            if (fangkuang == false) {
                var q_a= this.locationchangeX(posx);
                var q_b =this.locationchangeY(posy);
                if(GLB.isRoomOwner==true&&this.chessboarrd[q_a][q_b]==2){
                this.fangPool = new cc.NodePool();
                
                    var enemy = cc.instantiate(this.tubiao);
                    this.fangPool.put(enemy);
                
                    var enemy = this.fangPool.get();
                    enemy.index = 20;
                    this.node.addChild(enemy);
                    enemy.y = posy;
                    enemy.x = posx;
                }
                if(GLB.isRoomOwner==false&&this.chessboarrd[q_a][q_b]==1){
                        this.fangPool = new cc.NodePool();
                    
                        var enemy = cc.instantiate(this.tubiao);
                        this.fangPool.put(enemy);
                    
                        var enemy = this.fangPool.get();
                        enemy.index = 20;
                        this.node.addChild(enemy);
                        enemy.y = posy;
                        enemy.x = posx;
                    }
                
            } else {
                
                
                    for (var i = 0; i < this.node.childrenCount; i++) {
                        var q = this.node.children[i];
                        if (q.index == 20) {
                            var a= this.locationchangeX(q.x);
                            var b =this.locationchangeY(q.y);
                            var c= this.locationchangeX(posx);
                            var d =this.locationchangeY(posy);
                           if(this.chessboarrd[a][b]==this.chessboarrd[c][d]){
                            q.x=posx;
                            q.y=posy;
                           }
                            if (this.isCanGo(q.x,q.y, posx, posy) == true) {
                                this.TheFirstGo(q.x,q.y,posx,posy);
                                
                            } else {
                                console.log('99999999999999');
                                
                            }
                        }
                    }
            }
        }
    },
    initEvent:function () {
        cc.systemEvent.on(msg.MATCHVS_SEND_EVENT_NOTIFY,this.onEvent,this);
        
    },
    removeEvent:function () {
        cc.systemEvent.off(msg.MATCHVS_SEND_EVENT_NOTIFY,this.onEvent,this);
        
    },

    onEvent:function (event) {
        let eventData = event.data;
        
        switch (event.type) {
            case msg.MATCHVS_SEND_EVENT_NOTIFY:
            let data = JSON.parse(eventData.eventInfo.cpProto);
            let w=data.info;
            if(data.action==msg.WOSHIFANGZHU&&GLB.isRoomOwner==true){
                this.TheGo(w[0],w[1],w[2],w[3]);
                for (var i = 0; i < this.node.childrenCount; i++) {
                    var q = this.node.children[i];
                    if (q.index == 20) {
                        this.fangPool.put(q);
                    }
                }
                
                this.finallypanduan(1);
            }
            if(data.action==msg.WOSHIFANGZHU&&GLB.isRoomOwner==false){
                this.THEOtherGO(w[0],w[1],w[2],w[3]);
                GLB.begin=true;
                //this.timer=setInterval(this.countDown(),1000);
                this.finallypanduan(2);
            }
            if(data.action==msg.WOBUSHIFANGZHU&&GLB.isRoomOwner==true){
                this.THEOtherGO(w[0],w[1],w[2],w[3]);
                GLB.begin=true;
                //this.timer=setInterval(this.countDown(),1000);
                this.finallypanduan(2);
            }
            if(data.action==msg.WOBUSHIFANGZHU&&GLB.isRoomOwner==false){
                this.TheGo(w[0],w[1],w[2],w[3]);
                for (var i = 0; i < this.node.childrenCount; i++) {
                    var q = this.node.children[i];
                    if (q.index == 20) {
                        this.fangPool.put(q);
                    }
                }
                
                this.finallypanduan(1);
            }
                
            
            break;
        }
    },
    suanIsEmpty: function (posx, posy) {
        for (var i = 0; i < this.node.childrenCount; i++) {
            var q = this.node.children[i];
            if (q.x == posx && q.y == posy) {
                return q;
            }
        }
        return false;
    },
    isCanGo: function (q_x,q_y, posx, posy) {
        var q_a = this.locationchangeX(q_x);
        var q_b = this.locationchangeY(q_y);
        var pos_x = this.locationchangeX(posx);
        var pos_y= this.locationchangeY(posy);
        if(this.chessboarrd[q_a][q_b]==1&&GLB.isRoomOwner==false){
            if(q_x==posx&&q_y==posy){
                return false;
            }
            if(q_x==posx){
                if(Math.abs(q_y-posy)==this.LongX&&this.chessboarrd[pos_x][pos_y]==0){return true;}
                else{return false;}
            }else if(q_y==posy&&this.chessboarrd[pos_x][pos_y]==0){
                if(Math.abs(q_x-posx)==this.LongX){return true;}
                else{return false;}
            }
            if(q_x!=posx&&q_y!=posy)return false;
        }
        if(this.chessboarrd[q_a][q_b]==2&&GLB.isRoomOwner==true){
            if(q_x==posx&&q_y==posy){
                return false;
            }
            if(q_x==posx){
                if(Math.abs(q_y-posy)==this.LongX&&this.chessboarrd[pos_x][pos_y]==0){return true;}
                else if(Math.abs(q_y-posy)==2*this.LongX&&this.chessboarrd[pos_x][pos_y]==1){
                    if(q_y>posy&&this.chessboarrd[q_a][q_b+1]==0){
                        return true;
                    }else if(q_y<posy&&this.chessboarrd[q_a][q_b-1]==0){
                        return true;
                    }else{
                        return false;
                    }

                }
                else{
                    return false;
                }
            }else if(q_y==posy){
                if(Math.abs(q_x-posx)==this.LongX&&this.chessboarrd[pos_x][pos_y]==0){return true;}
                else if(Math.abs(q_x-posx)==2*this.LongX&&this.chessboarrd[pos_x][pos_y]==1){
                    if(q_x>posx&&this.chessboarrd[q_a-1][q_b]==0){
                        return true;
                    }else if(q_x<posx&&this.chessboarrd[q_a+1][q_b]==0){
                        return true;
                    }else{
                        return false;
                    }
                }else {
                    return false;
                }
            }
            if(q_x!=posx&&q_y!=posy)return false;
        }
    },
    TheFirstGo(q_x,q_y, posx, posy) {
        var q_a= this.locationchangeX(q_x);
        var q_b =this.locationchangeY(q_y);
        var pos_x =this.locationchangeX(posx);
        var pos_y =this.locationchangeY(posy);
        this.shuzu=[q_a,q_b,pos_x,pos_y];
        console.log(q_a,q_b,pos_x,pos_y);
       
       
       
           if(GLB.isRoomOwner==true){ 
            let event = {
               action:msg.WOSHIFANGZHU,
                info:this.shuzu,
            };
            engine.prototype.sendEventEx(0,JSON.stringify(event));;
            
            GLB.begin=false;
        }else{
            let event={
                action:msg.WOBUSHIFANGZHU,
                info:this.shuzu,
            }
            engine.prototype.sendEventEx(0,JSON.stringify(event));;
            
            GLB.begin=false;
        }
            
           
        
        

        
        
    },
    TheGo:function(q_x,q_y, posx, posy){
        console.log('55555555555555');
        
        var q_a= q_x;
        var q_b =q_y
        var pos_x = posx;
        var pos_y = posy;
        var q_x=q_x*this.LongX-2*this.LongX;
        var q_y=-(q_y*this.LongX-2*this.LongX);
        var posx=posx*this.LongX-2*this.LongX;
        var posy=-(posy*this.LongX-2*this.LongX);
       
        this.FINALLYGO(q_a,q_b,q_x,q_y,pos_x,pos_y,posx,posy);
        
        
    },
    THEOtherGO:function(q_x,q_y, posx, posy){

        var q_a= 4-q_x;
        var q_b =4- q_y;
        var pos_x =4- posx;
        var pos_y =4- posy;
        var q_x =-(q_x*this.LongX-2*this.LongX);
        var q_y=q_y*this.LongX-2*this.LongX;
        var posx=-(posx*this.LongX-2*this.LongX);
        var posy=posy*this.LongX-2*this.LongX;
       
        this.FINALLYGO(q_a,q_b,q_x,q_y,pos_x,pos_y,posx,posy);

    },
    locationchangeX:function(parm){
        return parseInt((parm+2*this.LongX)/this.LongX);
    },
    locationchangeY:function(parm){
        return parseInt(-(parm-2*this.LongX)/this.LongX);
    },
    finallypanduan:function(c){


       
        var a=this.bingwin();
        var b=this.paowin();

        /*if(c==1){
            clearInterval(this.timer);
            this.jishi.string="--";
        }
        if(c==2){
            if(a==true||b==true){
                clearInterval(this.timer);
                this.jishi.string="--";
            }
        }*/
        if(b==true){
            if(GLB.isRoomOwner==true){
                GLB.score=GLB.score+1;
                GLB.isWin=true;
                GLB.roomID = "";
                cc.director.loadScene("result");   
            }
            if(GLB.isRoomOwner==false){
                GLB.score=GLB.score-1;
                GLB.roomID = "";
                cc.director.loadScene("result");
            }
        }
        if(a==true){
            if(GLB.isRoomOwner==true){
                GLB.score=GLB.score-1;
                GLB.roomID = "";
                cc.director.loadScene("result");
            }
            if(GLB.isRoomOwner==false){
                GLB.score=GLB.score+1;
                GLB.isWin=true;
                GLB.roomID = "";
                cc.director.loadScene("result");
            }
        }
    },
    bingwin: function () {
        var paoNumber = 0;
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                if (this.chessboarrd[i][j]==2) {
                    if (this.decidepao(i,j) == true) {
                        paoNumber++;
                    }
                }
            }
        }
        if (paoNumber == 3) {
            return true;
        }else{
            return false;
        }
    },
    paowin: function () {
        var NumberCount = 0;
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                if (this.chessboarrd[i][j]>0) {
                    NumberCount++;
                }
            }
        }
        if (NumberCount == 7) {
            return true;
        }else{
            return false;
        }
    },
    decidepao: function (i,j) {
        if (i == 0) {
            if (j == 0 && this.chessboarrd[i + 1][j] > 0 && this.chessboarrd[i][j + 1] > 0) return true;
            if (j > 0 && j < 4) {
                if (this.chessboarrd[i][j - 1] > 0 && this.chessboarrd[i][j + 1] > 0 && this.chessboarrd[i + 1][j] > 0)
                    return true;
            }
            if (j == 4 && this.chessboarrd[i][j - 1] > 0 && this.chessboarrd[i + 1][j] > 0) return true;
        }
        if (i == 4) {
            if (j == 0 && this.chessboarrd[i - 1][j] > 0 && this.chessboarrd[i][j + 1] > 0) return true;
            if (j > 0 && j < 4) {
                if (this.chessboarrd[i][j - 1] > 0 && this.chessboarrd[i][j + 1] > 0 && this.chessboarrd[i - 1][j] > 0)
                    return true;
            }
            if (j == 4 && this.chessboarrd[i][j - 1] > 0 && this.chessboarrd[i - 1][j] > 0) return true;
        }
        if (j == 0 && i > 0 && i < 4&& this.chessboarrd[i + 1][j] > 0 && this.chessboarrd[i - 1][j] > 0 && this.chessboarrd[i][j + 1] > 0)
            return true;
        if (j == 4 && i > 0 && i < 4&& this.chessboarrd[i + 1][j] > 0 && this.chessboarrd[i - 1][j] > 0 && this.chessboarrd[i][j - 1] > 0)
            return true;
    },
   
   
    FINALLYGO:function(q_a,q_b,q_x,q_y,pos_x,pos_y,posx,posy){
        console.log('33333333333');
        
        if(this.chessboarrd[q_a][q_b]==1&&this.chessboarrd[pos_x][pos_y]==0){
            for (var i = 0; i < this.node.childrenCount; i++) {
                var q = this.node.children[i];
                if(q.x==q_x&&q.y==q_y&&q.index==1){
                    q.x=posx;
                    q.y=posy;
                }
                
            }
            this.chessboarrd[q_a][q_b]=0;
            this.chessboarrd[pos_x][pos_y]=1;
        }
        if(this.chessboarrd[q_a][q_b]==2&&this.chessboarrd[pos_x][pos_y]==0){
            console.log('2222222222222');
            for (var i = 0; i < this.node.childrenCount; i++) {
                var q = this.node.children[i];
                if(q.x==q_x&&q.y==q_y&&q.index==2){
                   
                    q.x=posx;
                    q.y=posy;
                }
                
                
            }
            this.chessboarrd[q_a][q_b]=0;
            this.chessboarrd[pos_x][pos_y]=2;
        }
       
        if(this.chessboarrd[q_a][q_b]==2&&this.chessboarrd[pos_x][pos_y]==1){
            for (var i = 0; i < this.node.childrenCount; i++) {
                var q = this.node.children[i];
                
                if(q.x==posx&&q.y==posy&&q.index==1){
                    this.enemyPool.put(q);
                    console.log('999999999999999999999');
                }
                if(q.x==q_x&&q.y==q_y&&q.index==2){
                    q.x=posx;
                    q.y=posy;
                }
                
                
            }
            this.chessboarrd[q_a][q_b]=0;
            this.chessboarrd[pos_x][pos_y]=2;
        }
    },
    onDestroy:function () {
        this.removeEvent();
        console.log("Match页面销毁");
    },
    
    shujuzhuanhuan:function (pos) {
        
        
        switch (pos) {
            case 0:
            return 0;
            break;
            case 1:
            case 2:
           return this.LongX;

            break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            return 2*this.LongX;
            break;
            case -2:
            case -1:
            return -this.LongX;
            break;
            case -3:
            case -4:
            case -5:
            case -6:
            case -7:
            case -8:
            case -9:
            case -10:
            return -2*this.LongX;
            break;
        }
    },
    
});
