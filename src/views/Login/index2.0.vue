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
        :model="ruleForm"
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
                v-model.number="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              size="middle"
              type="success"
              @click="submitForm('ruleForm')"
              style="margin-top:18px;width:100%"
              >获取验证码</el-button
            >
          </el-col>
        </el-row>

        <el-button
          type="danger"
          @click="resetForm('ruleForm')"
          class="login_button"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>
<script>
import { stripscript, validateEmail, validatePassword, validateVerifyCode } from '@/utils/validator.js'
export default {
  name: "login",
  data () {
    //用户名校验
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
      this.ruleForm.passWord = stripscript(value)
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
      this.model === 'login' && callback();
      //数据过滤，重新赋值
      this.ruleForm.passWords = stripscript(value)
      value = stripscript(value)
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value != this.ruleForm.passWord) {
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
    return {
      menuTab: [{ text: "登录", model: "login" }, { text: "注册", model: "register" }],
      currentIndex: 1,
      //模块值
      model: 'register',
      ruleForm: {
        userName: '',
        passWord: '',
        passWords: '',
        code: ''
      },
      rules: {
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
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    toggleMenu (index, item) {
      this.model = item.model
      console.log(item)
      this.currentIndex = index;
      console.log(index);
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
