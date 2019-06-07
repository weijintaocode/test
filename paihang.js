let GLB=require("Glb");
//主域
cc.Class({
    extends: cc.Component,
    properties: {
        rankingScrollView: cc.Sprite,//显示排行榜
    },
    start() {
        this.tex = new cc.Texture2D();
    },
    onLoad() {
        //保存数据
        window.wx.setUserCloudStorage({
            KVDataList:[{key:"score",value: GLB.score.toString(2)},{key:"username",value:GLB.name}],
            success: function (res) {
                console.log("getUserCloudStorage 成功");   
            },
            fail: function (res) {
                console.log("getUserCloudStorage 失败");  
            }
        });
        window.wx.postMessage({
            keyName:"score",
            keyUsername:"GLB.name",
        });
    },
    update() {
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
    },
});
/*function drawRankNum(rank, y) {
            if (rank <= 3) {
                // 绘制排名的名次图片 此处仅绘制前3名
                let img = wx.createImage();
                img.src = "customRes/rank" + rank + ".png";
                img.onload = function (res) {
                    let heightImg = res.target.height;
                    let widthImg = res.target.width;
                    context.drawImage(img, 0, 0, widthImg, heightImg, -20, y + 14, 114, 112)
                }
            } else if (rank < 10) {
                context.font = "bold 64px Calibri";
                context.fillText(rank, 68, y + 94);
            } else if (rank < 100) {
                context.font = "bold 60px Calibri";
                context.fillText(rank, 68, y + 94);
            } else {
                context.font = "bold 60px Calibri";
                context.fillText("99+", 64, y + 94);
            }
        }*/
