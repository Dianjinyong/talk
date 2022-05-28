//账号的验证规则
//他是异步的，等待账号的验证需要时时间啊
const loginIdValodator = new FieldValidator("txtLoginId", async function (val) {
    if (!val) {
      return "账号不能为空";
    }
  });
  

  
  //密码的验证规则
  const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
    if (!val) {
      return "请填写密码";
    }
  });

  
  const form = $(".user-form");
  form.onsubmit = async (e) => {
    //表单提交事件
    e.preventDefault(); //阻止事件默认行为
    const result = await FieldValidator.validate(
      loginIdValodator,
      loginPwdValidator,
    ); //表单提交时在次验证各个表单
    if (!result) {
      return; //验证未通过结束
    }
    const formData = new FormData(form); //浏览器提供的函数 传入表单dom得到一个表单数据对象
    const data = Object.fromEntries(formData.entries()); //迭代器  转换为对象格式  减课程49分钟的时候演示
    //   console.log(data);
    const resp = await API.longId(data) //调用注册端口
    if (resp.code === 0) {
      //如果响应体的code为0 没有错误
      alert("登陆成功，点击确定，跳转到首页"); //弹窗告诉说注册成功
      location.href = baseURL; //跳转到聊天界面
    }else{
        loginPwdValidator.p.innerText = '账号或密码错误';
        loginIdValodator.input.value = '';
        loginPwdValidator.input.value = '';
        // alert('账号或密码错误')
        
    }
  };
  