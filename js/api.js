

var API = (function(){
    const BASE_URL = 'https://study.duyiedu.com';
    const TOKEN_KEY = "token";
    
    //get请求
    function get(path){
        const headers = {};//创建一个headers的空对象
        const token = localStorage.getItem(TOKEN_KEY);//判断有没有令牌
        if(token){
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path,{headers});
    }
    
    //post请求
    function post(path,bodyObj){
        const headers = {
            "Content-Type": "application/json"
        };//创建一个headers的空对象
        const token = localStorage.getItem(TOKEN_KEY);//判断有没有令牌
        if(token){
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path,{method:"POST",headers,body:JSON.stringify(bodyObj)});
    
    
    }
    
    //用户注册
    // async function reg(userInfo){
    //    return await fetch(BASE_URL + "/api/user/reg", {
    //          method: 'POST',
    //          headers: {
    //              "Content-Type": "application/json"
    //          },
    //          body: JSON.stringify(userInfo),//把我们要传过来的对象装换为json格式的字符串
    //      }).then(resp => resp.json())
    // }
    //更容易理解的用户注册方法
    // async function reg(userInfo){
    //     const resp =  await fetch(BASE_URL + "/api/user/reg", {
    //           method: 'POST',
    //           headers: {
    //               "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify(userInfo),//把我们要传过来的对象装换为json格式的字符串
    //       })
    //     return await resp.json();
    //  }
    
    //封装后用户注册
    async function reg(userInfo){
        const resp =  await post("/api/user/reg", userInfo)
        return await resp.json();
     }
    
    //用户注册测试
    // reg({
    //     "loginId":"tuji",
    //     "nickname":"土鸡",
    //     "loginPwd":"123123"
    // }).then(resp => console.log(resp))
    
    
    
    // //登陆
    // async function longId(longinInfo){
    //   const resp = await fetch(BASE_URL + "/api/user/login",{
    //        method: 'POST',
    //        headers: {
    //            "content-type": "application/json"
    //        },
    //        body: JSON.stringify(longinInfo)
    //    })
    //     const result =  await resp.json();
    //     if(result.code === 0 ){
    //     //我们要的不是你的账号密码是验证成功后的令牌
    //     //将响应头中的token保存到localStorage中
    //     const token = resp.headers.get('authorization')
    //     localStorage.setItem(TOKEN_KEY,token)//保存到本地
    //     }
    //     return result
    // }
    
    //登陆封装后
    async function longId(longinInfo){
        const resp = await post( "/api/user/login",longinInfo)
          const result =  await resp.json();
          if(result.code === 0 ){
          //我们要的不是你的账号密码是验证成功后的令牌
          //将响应头中的token保存到localStorage中
          const token = resp.headers.get('authorization')
          localStorage.setItem(TOKEN_KEY,token)//保存到本地
          }
          return result
      }
    
    // // 登陆测试
    // longId({
    //     "loginId":"tuji",
    //     "loginPwd":"123123"
    // }).then(resp => console.log(resp))
    
    
    
    //账号验证
    async function exists(longinId){
        const resp = await get('/api/user/exists?loginId=' + longinId);
        return await resp.json();
    }
    // exists("tuji").then(resp => console.log(resp))
    
    
    //当前登陆的用户信息
    async function profile(){
      const resp = await get("/api/user/profile");
      return await resp.json();
    }
    // profile().then(resp => console.log(resp))
    
    //发送聊天消息
    async function sendChat(content){
        const resp = await post("/api/chat",{
            content
        })
        return await resp.json();
    }
    
    //获取聊天消息
    async function getHistory(){
        const resp = await get("/api/chat/history")
        return await resp.json();
    }
    
    //退出登陆  删除令牌 token
    function loginOut(){
        localStorage.removeItem(TOKEN_KEY)
    }

    return {
        reg,
        longId,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut,
    }

})()