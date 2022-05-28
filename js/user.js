//用户登陆和注册的表单验证项的通用代码
/**
 * 对某个表单进行验证的构造函数
 */
class FieldValidator {
  //构造函数新写法
  /**
   *
   * @param {string} txtId 文本框的ID
   * @param {function} validatorFunc 验证规则的函数，当需要对该文本框进行验证时，
   *                                 会调用该函数，函数的参数为文本框的值，函数
   *                                 的返回值为验证的错误消息，若没有返回，则表示无错误
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId); //拿到这个id的input元素  dom元素
    this.p = this.input.nextElementSibling; //拿到这个input元素的下一个兄弟元素p标签用于显示错误消息
    this.validatorFunc = validatorFunc;//把验证规则保存到变量中
    // console.log(this.input,this.p);
    // 失去焦点。表单提交时都要验证
    this.input.onblur = () => {  //给这个input注册失去焦点时的事件
        this.validate();  // 当他失去焦点的时候我要触发验证
    }
  }
  /**
   *验证方法 成功返回ture失败返回false
   */
 async validate() {//原型方法：写在原型上的方法叫原型方法
    //   触发验证方法时调用验证规则函数 这个函数的参数为input元素的文本内容 
    const err = await this.validatorFunc(this.input.value)//默认是异步的需要等待他的结果在进行下面的操作
    if(err) {//验证文本框的值是不是有错误，如果有错误p元的innerText值为validatorFunc函数的返回值  并且返回false
        this.p.innerText = err;
        return false;    
    }else{//没有错误p元素文本为空返回ture
        this.p.innerText = '';
        return true;
    }
  }
//静态方法：直接写在构造函数里的方法叫静态方法
//原型方法：写在原型上的方法叫原型方法
/**
 * 对传入的所有验证器进行统一的验证，如果所有的验证都通过返回ture，否则放回false
 * @param {FieldValidator[]} validatos //函数的实例类型 
 */
static async validate(...validatos){//必须是异步的
 const proms = validatos.map(v => v.validate())//映射每个验证器的validate方法 因为他是一个promise所以返回的也是promise
  const results = await Promise.all(proms);//全部成功才成功一个失败就失败 返回的是一个数组
  return results.every(r => r);//判断results数组是不是每一项都是ture

}
}

//                                                //他是异步的，等待账号的验证需要时时间啊
// const loginIdValodator = new FieldValidator("txtLoginId",async function (val) {
//   if (!val) {
//     return "账号不能为空";
//   }
//   const resp = await API.exists(val);
//   if(resp.data){
//       return "该账号已被占用，请重新选择账号"
//   }
// });

// //昵称的验证
// const nicknameValidator = new FieldValidator('txtNickname',function(val){
//     if(!val){
//         return '请填写昵称';
//     }
// })
