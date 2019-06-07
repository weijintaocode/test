/*let sharedCanvas = null;
let context = null;
let heightPerUser = 146; // 单个玩家排行的高度
let widthPerUser = 808; // 单个玩家排行的宽度
wx.onMessage(function (data) {
  if (sharedCanvas == null) {
    sharedCanvas = wx.getSharedCanvas();
  }
  if (context == null) {
    // 获取画布对象的绘图上下文
    context = sharedCanvas.getContext('2d');
  }
  // 清除画布上在该矩形区域内的内容
  context.clearRect(0, 0, widthPerUser, heightPerUser * 10);
  wx.getUserCloudStorage({
    keyList: ["username"],
    success: function (res) {
      // 先获得自己的数据，这样在排行榜中可以突显自己的位置
      // (若没有这个需求，可以不要这一步)
      let kvData = res.KVDataList;
      let myKvData = kvData[0];
      let myUsername = "";
      if (myKvData != null) {
        myUsername = res.KVDataList[0].value;
      }
      // 当前用户所有同玩好友的托管数据
      wx.getFriendCloudStorage({
        keyList: [data.keyName, data.keyUsername],
        success: function (res) {
          drawRankList(res, myUsername, data.keyName, data.keyUsername, data.keyUnit);
        },
        fail: function (res) {
          drawFail();
        },
      });
    },
    fail: function (res) {
      console.log("getUserCloudStorage 失败");
      drawFail();
    }
  });
});
function drawRankList(res, myUsername, keyName, keyUsername, unitName = "") {
  if (res == null || res.data == null || res.data.length == null || res.data.length < 1) {
    drawFail();
    return;
  }
  //初始化信息
  let data = res.data;
  let rankInfo = [];
  for (let i in data) {
    let personData = data[i];
    let usernameKeyIndex = -1;
    let keyNameIndex = -1;
    let KVDataLen = personData.KVDataList.length; // KVDataList是用户的托管 KV 数据列表
    for (let i = 0; i < KVDataLen; i++) {
      if (personData.KVDataList[i].key === keyUsername) {
        usernameKeyIndex = i;
      } else if (personData.KVDataList[i].key === keyName) {
        keyNameIndex = i;
      }
    }
    let obj = {};
    if (personData.KVDataList[keyNameIndex] != null) {
      obj.score = personData.KVDataList[keyNameIndex].value;
    } else {
      obj.score = "-1";
    }
    if (personData.nickname) {
      obj.nickname = personData.nickname;
    }
    if (personData.avatarUrl) {
      obj.headimgurl = personData.avatarUrl;
    }
    if (personData.KVDataList[usernameKeyIndex] != null) {
      obj.username = personData.KVDataList[usernameKeyIndex].value;
    }
    obj.rank = 0;
    obj.isSelf = false;
    rankInfo.push(obj);
  }
  console.log("共获取到了排行数据数量：" + rankInfo.length);
  //对排行数据排序
  rankInfo.sort(function (m, n) {
    let intM = parseInt(m.score);
    let intN = parseInt(n.score);
    if (typeof intM !== "number" || intM == NaN || intM < 0) {
      intM = -1;
    }
    if (typeof intN !== "number" || intN == NaN || intN < 0) {
      intN = -1;
    }
    m.score = intM;
    n.score = intN;
    if (intM > intN) {
      return -1;
    } else if (intM < intN) {
      return 1;
    } else {
      // 名次相等，按固定规则排序
      if (m.nickname > n.nickname) {
        return 1;
      }
      if (m.nickname < n.nickname) {
        return -1;
      }
      return 0;
    }
  });
  let rank = 0;
  for (let i = 0; i < rankInfo.length; i++) {
    rank++;
    rankInfo[i].rank = rank;
  }
  for (let i = 0; i < rankInfo.length; i++) {
    let st = rankInfo[i].score;
    if (st == -1) {
      st = "暂无数据";
    } else {
      st = st + unitName;
    }
    rankInfo[i].score = st;
    if (rankInfo[i].username === myUsername) {
      // 找到自己 方便后面排名时，突显自己
      rankInfo[i].isSelf = true;
    }
  }
  draw(rankInfo);
}
function draw(rankInfo) {
  for (let i = 0; i < rankInfo.length; i++) {
    let rankItem = rankInfo[i];
    let y = i * heightPerUser;
    context.textAlign = 'left';
    if (rankItem == null || rankItem == {}) {
      context.fillStyle = "#FFDEC0";
      context.font = "bold 56px SimHei";
      context.fillText("无法获得玩家数据", 110, y + 90);
      continue;
    }
    if (rankItem.isSelf) {
      context.fillStyle = "#a37d56";
      context.fillRect(0, y, widthPerUser, heightPerUser);
    }
    let nickname = rankItem.nickname;
    let score = rankItem.score;
    let headimgurl = rankItem.headimgurl;
    let rank = "" + rankItem.rank;
    let scoreTextLen = renderLengthOf(score);
    let fontReduce = Math.floor(scoreTextLen - 11);
    if (fontReduce < 0) {
      fontReduce = 0;
    }
    context.font = "20px SimHei";
    context.fillStyle = '#FFDEC0';
    context.fillText(score, 150, y + 126);
    context.fillStyle = "#FFFFFF";
    nickname = trimString(nickname, 13);
    context.font = "20px SimHei";
    context.fillText(nickname, 150, y + 58);
    // 绘制头像
    let img = wx.createImage();
    img.src = headimgurl;
    img.onload = function (res) {
      let heightImg = res.target.height;
      let widthImg = res.target.width;
      context.drawImage(img, 0, 0, widthImg, heightImg, 100, y + 10, 50, 100);
    }
    context.textAlign = 'center';
    //drawRankNum(rank, y);
    if (i > 8) {
      // 仅绘制前10个玩家
      break;
    }
  }
  for (let j = 0; j < 10; j++) {
    let y = j * heightPerUser;
    context.fillStyle = "#a5805a";
    context.fillRect(0, y + heightPerUser - 4, widthPerUser, 2);
    context.fillStyle = "#d5ad88";
    context.fillRect(0, y + heightPerUser - 2, widthPerUser, 2);
  }
}
// 渲染长度
function renderLengthOf(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    if (isChinese(str.charAt(i))) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
}
//判断是不是中文  
function isChinese(char) {
  var reCh = /[u00-uff]/;
  return !reCh.test(char);
}
//截断过长的文字，用...代替过长的部分，注意这里判断是基于文字的渲染长度
function trimString(string, renderLengthMax) {
  let len = string.length;
  let renderLen = renderLengthOf(string);
  let l = 0;
  if (renderLen > renderLengthMax) {
    let lenToSubstr = 0;
    for (let i = 0; i < len; i++) {
      if (isChinese(string[i])) {
        l += 2;
      } else {
        l += 1;
      }
      lenToSubstr++;
      if (l >= renderLengthMax) {
        string = string.substr(0, lenToSubstr);
        string = string + "..";
        break;
      }
    }
  }
  return string;
}

function drawFail() {
  context.textAlign = 'left';
  context.font = "bold 56px SimHei";
  context.fillStyle = '#FFFFFF';
  context.fillText("无法获取排行数据", 110, 90);
  context.fillStyle = '#FFDEC0';
  context.fillText("请过段时间再来", 110, heightPerUser + 90);
}
*/