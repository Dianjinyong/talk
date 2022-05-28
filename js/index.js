//验证是否有登录，如果没有登录，跳转到登录页面，
//如果有登录获取登录，获取到登陆的用户信息
(async function () {
  const resp = await API.profile(); //验证用户登陆信息
  const user = resp.data;
  // console.log(user);
  if (!user) {
    //判断user信息 如果没有登陆为null 登陆了则显示为一个对象
    alert("未登录或登陆已过期，请重新登陆"); //弹窗显示
    location.href = "../login.html"; //跳转到登陆界面
    return; //不在往后执行
  }

  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };

  setUserInfo(); //设置用户信息

  //注销事件
  doms.close.onclick = function () {
    API.loginOut(); //注销的函数
    location.href = "../login.html"; //跳转到登陆页面
  };

  await loadHistory(); //加载历史记录
  //   加载历史记录
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  //发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    //这是一个表单提交事件
    e.preventDefault(); //阻止事件默认行为
    sendChat();
  };

  //下面的代码环境一定是登陆状态
  //设置用户信息
  function setUserInfo() {
    //他们必须用innertext 不能为innerHTML  不要信任用户提交的东西
    //要显示就显示存文本
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  //添加消息函数 根据消息对象将其添加到页面中
  /**
 * content: "你好！你叫啥啊？"
   createdAt: 1653467503791  //这是一个时间戳
   from: "tuji"
   to:null
 */
  function addChat(chatInfo) {
    const div = $$$("div"); //创建一个div
    div.classList.add("chat-item"); //设置内样式
    if (chatInfo.from) {
      //如果from有值那么他就是人发的
      div.classList.add("me"); //调价内样式
    }
    const img = $$$("img"); //
    img.className = "chat-avatar"; //设置内样式
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg"; //判断是不是人发的 是人发了img地址为第一个 否则为第二个

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  //让聊天区域的滚动条滚动到最后
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight; //设置滚动条高度
    console.log(doms.chatContainer.scrollHeight); //内容区域高度
  }

  //将时间戳装换为 时间格式显示
  function formatDate(timestamp) {
    const date = new Date(timestamp); //根据时间戳得到一个日期对象
    // console.log(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  //发送消息函数
  async function sendChat() {
    const content = doms.txtMsg.value.trim(); //获取消息文本框的内容
    if (!content) {
      //如果文本框没有内容啥也别做
     return;
    }
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = ""; //清空聊天输入框
    scrollBottom();
    const resp = await API.sendChat(content); //有内容就调用发送消息的接口  没有必要等待 先把消息发出去 提升用户体验
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data, //展开运算符
    });
    scrollBottom();
  }
})();
