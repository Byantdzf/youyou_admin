<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="password">
      <Input v-model="form.password"  type="password" placeholder="请输入新密码">
      <span slot="prepend">
        输入密码
        </span>
      </Input>
    </FormItem>
    <FormItem prop="passwordCopy">
      <Input type="password" v-model="form.passwordCopy" placeholder="请再次输入密码">
      <span slot="prepend">
          确定密码
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" :loading="load" long style="letter-spacing: 2px;">修改密码 </Button>
    </FormItem>
  </Form>
</template>
<script>
    export default {
        name: 'LoginCode',
        props: {
            passwordRules: {
                type: Array,
                default: () => {
                    return [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            },
          passwordCopyRules: {
            type: Array,
            default: () => {
              return [
                {required: true, message: '密码不能为空', trigger: 'blur'}
              ]
            }
          },
            load: {
                type: Boolean
            }
        },
        data() {
            return {
                form: {
                  password: null,
                  passwordCopy: null
                }
            }
        },
        computed: {
            rules() {
                return {
                  password: this.passwordRules,
                  passwordCopy: this.passwordCopyRules
                }
            }
        },
        methods: {
            handleSubmit() {
              if(this.form.password !== this.form.passwordCopy){
                return this.$Message.error('两次密码输入不一致')
              }
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-changePassword', {
                          password: this.form.password,
                          confirm_password: this.form.passwordCopy
                        })
                    }
                })
            }
        }
    }
</script>
