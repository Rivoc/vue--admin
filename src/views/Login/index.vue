<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="(item, index) in menuTab"
          :class="{ current: index === currentIndex }"
          @click="toggleMenu(index, item, $event)"
          :key="item.id"
        >
          {{ item.text }}
        </li>
      </ul>
      <!-- 表单开始 -->
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="login-form"
        size="medium"
        label-position="top"
      >
        <el-form-item label="邮箱" prop="userName">
          <el-input v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input
            type="password"
            v-model="ruleForm.passWord"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="重复密码"
          prop="passWords"
          v-show="model === 'register'"
        >
          <el-input
            type="password"
            v-model="ruleForm.passWords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-row type="flex" align="middle" :gutter="20">
          <el-col :span="16">
            <el-form-item label="验证码" prop="code" class="el-form-item_label">
              <el-input
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              size="middle"
              type="success"
              @click="getSms()"
              style="margin-top:18px;width:100%"
              :disabled="codeButtonStatus.status"
              >{{ codeButtonStatus.text }}</el-button
            >
          </el-col>
        </el-row>

        <el-button
          type="danger"
          @click="submitForm('loginForm')"
          class="login_button"
          :disabled="loginButtonStatus"
          >{{ model === "login" ? "登录" : "注册" }}</el-button
        >
      </el-form>
    </div>
  </div>
</template>
<script>
import { stripscript, validateEmail, validatePassword, validateVerifyCode } from '@/utils/validator.js'
import { reactive, ref } from '@vue/composition-api'
import { GetSms, Register } from '@/api/login.js'
export default {
  name: "login",
  // setup (props, context)
  setup (props, { refs, root }) {
    //校验规则
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if (validateEmail(value)) {
        callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }

    }
    //密码校验
    var validatePass = (rule, value, callback) => {
      //数据过滤，重新赋值
      ruleForm.passWord = stripscript(value)
      value = stripscript(value)
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (validatePassword(value)) {
        callback(new Error('密码格式不正确'));
      } else {
        callback();
      }
    }
    //重复密码校验
    var validatePasss = (rule, value, callback) => {
      //如果是登录页面，直接通过（使用v-show的情况下会有bug：登录页面里重复密码只是隐藏起来，验证会不通过导致登录无法提交表单信息出现bug，因此需要多加一个判断）
      model.value === 'login' && callback();
      //数据过滤，重新赋值
      ruleForm.passWords = stripscript(value)
      value = stripscript(value)
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value != ruleForm.passWord) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    }
    //验证码校验
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (validateVerifyCode(value)) {
        callback(new Error('验证码格式错误'));
      } else {
        callback();
      }
    }


    //声明数据
    const menuTab = reactive([{ text: "登录", model: "login" }, { text: "注册", model: "register" }])
    let ruleForm = reactive({
      userName: '',
      passWord: '',
      passWords: '',
      code: ''
    })
    let rules = reactive({
      userName: [
        { validator: validateUserName, trigger: 'blur' }
      ],
      passWord: [
        { validator: validatePass, trigger: 'blur' }
      ],
      passWords: [
        { validator: validatePasss, trigger: 'blur' }
      ],
      code: [
        { validator: validateCode, trigger: 'blur' }
      ]
    })
    /********************************************************************************** */
    let currentIndex = ref(1)
    let model = ref('register')
    let loginButtonStatus = ref(true)
    let codeButtonStatus = reactive({
      status: false,
      text: '获取验证码'//验证码按钮可用
    })
    let timer = ref(null)

    /******************************************** */
    // eslint-disable-next-line no-unused-vars
    const getSms = () => {
      if (ruleForm.userName === "") {
        root.$message.error('用户名不能为空')
        return false
      }
      if (validateEmail(ruleForm.userName)) {
        root.$message.error('邮箱格式有误')
        return false
      }
      let data = {
        username: ruleForm.username,
        module: model.value
      }

      //修改验证码按钮状态
      codeButtonStatus.status = true
      codeButtonStatus.text = '发送中'


      setTimeout(async () => {
        await GetSms(data)
        root.$message.success('验证码已发送')
        //启用登录或注册按钮
        loginButtonStatus.value = false
        countDown(60)
      }, 5000)
    }

    //倒计时
    const countDown = (number) => {
      //60和0消失
      let time = number
      timer.value = setInterval(() => {
        time--
        if (time === 0) {
          codeButtonStatus.status = false
          codeButtonStatus.text = '重新获取'
          clearInterval(timer.value)

        }
        codeButtonStatus.text = `倒计时${time}秒`
      }, 1000)
    }
    const submitForm = (formName) => {
      refs[formName].validate(async (valid) => {
        if (valid) {
          let requestData = {
            username: ruleForm.username,
            module: model.value,
            password: ruleForm.password,
            code: ruleForm.code
          }
          let res = await Register(requestData)
          root.$message.success(res.data)
        } else {
          root.$message.error('登录失败')
          return false;
        }
      });
    }
    const resetForm = (formName) => {
      refs[formName].resetFields()
    }
    const toggleMenu = (index, item) => {
      model.value = item.model
      currentIndex.value = index;
      // eslint-disable-next-line no-undef
      refs[loginForm].resetFields()
      console.log(currentIndex.value);

    }
    return {
      menuTab,
      currentIndex,
      loginButtonStatus,
      model,
      submitForm,
      resetForm,
      getSms,
      toggleMenu,
      rules,
      ruleForm,
      codeButtonStatus,
      timer


    }
  },




}
</script>
<style lang="scss">
#login {
  height: 100vh;
  background-color: #344a5f;
}

.login-wrap {
  width: 350px;
  padding-top: 30px;
  margin: 0 auto;
  .menu-tab {
    text-align: center;
    display: flex;
    justify-content: space-around;
    li {
      display: inline-block;
      line-height: 36px;
      padding: 10px 30px;
      font-size: 14px;
      color: #fff;
      border-radius: 2px;
      cursor: pointer;
    }
    .current {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .login-form {
    margin-top: 29px;
    .el-form-item__label {
      color: #fff;
    }
    .login_button {
      display: block;
      width: 100%;
    }
  }
}
</style>
