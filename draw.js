cc.Class({
    extends: cc.Component,
    properties: {
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.graphics=this.getComponent(cc.Graphics);
        let windowSize = cc.view.getVisibleSize();
        this.A_width = windowSize.width;
        this.henghang = 6;
        this.LongX = parseInt(this.A_width / this.henghang);
        this.drawline();
    },
    drawline:function(){
        let graphics=this.graphics;
        graphics.strokeColor.fromHEX('#000000');
        for(let i=0;i<5;i++){
            graphics.moveTo((i-2)*this.LongX,2*this.LongX);
            graphics.lineTo((i-2)*this.LongX,-2*this.LongX);
        }
        for(let j=0;j<5;j++){
            graphics.moveTo(-2*this.LongX,this.LongX*(j-2));
            graphics.lineTo(2*this.LongX,this.LongX*(j-2));
        }
        graphics.stroke();
    },
    start () {
    },
    // update (dt) {},
});
