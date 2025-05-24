<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useTitle } from "@vueuse/core";
import { ElForm,ElMessage, ElFormItem, ElInput, ElButton, ElAlert } from "element-plus";
import type { FormRules } from "element-plus";
import { Lock, User, Message } from "@element-plus/icons-vue";
import { useAuthStore } from "../stores/auth";
import { httpClient } from '../utils/http'

useTitle("注册 - DevDeck");

const authStore = useAuthStore();
const router = useRouter();

// 表单数据
const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  captcha: "",
});

// 表单验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度应为3-20个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应为6-20个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value !== registerForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  captcha: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { min: 4, max: 4, message: "请输入4位验证码", trigger: "blur" },
  ],
});

const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
  const captchaUrl = ref<string>('')

async function fetchCaptcha() {
  try {
    const response = await httpClient.get<{ data: string }>('/user/captcha') 
    captchaUrl.value = response.data
  } catch (err) {
    ElMessage.error('获取验证码失败')
  }
}
// 注册处理函数
async function handleRegister() {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    isSubmitting.value = true;
    error.value = null;

    try {
      await authStore.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      });

      // 注册成功后跳转到登录页面
      router.push("/login");
    } catch (err: any) {
      error.value = err.message || "注册过程中发生错误";
    } finally {
      isSubmitting.value = false;
    }
  });
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          创建您的账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或
          <router-link
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            返回登录
          </router-link>
        </p>
      </div>

      <ElAlert
        v-if="error"
        type="error"
        :title="error"
        show-icon
        class="mb-4"
      />

      <ElForm
        ref="formRef"
        :model="registerForm"
        :rules="rules"
        class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow"
      >
        <ElFormItem prop="username">
          <ElInput
            v-model="registerForm.username"
            :prefix-icon="User"
            placeholder="用户名"
            autocomplete="username"
          />
        </ElFormItem>

        <ElFormItem prop="email">
          <ElInput
            v-model="registerForm.email"
            :prefix-icon="Message"
            placeholder="邮箱"
            autocomplete="email"
          />
        </ElFormItem>

        <ElFormItem prop="password">
          <ElInput
            v-model="registerForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
            autocomplete="new-password"
            show-password
          />
        </ElFormItem>

        <ElFormItem prop="confirmPassword">
          <ElInput
            v-model="registerForm.confirmPassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="确认密码"
            autocomplete="new-password"
            show-password
          />
        </ElFormItem>

        <ElFormItem prop="captcha">
          <div class="flex items-center">
            <ElInput
              v-model="registerForm.captcha"
              placeholder="验证码"
              class="flex-1"
            />
            <img
              :src="captchaUrl"
              alt="验证码"
              class="ml-2 h-10 cursor-pointer"
              @click="fetchCaptcha"
            />
          </div>
        </ElFormItem>
        <div>
          <ElButton
            type="primary"
            class="w-full"
            :loading="isSubmitting"
            @click="handleRegister"
          >
            注册
          </ElButton>
        </div>
      </ElForm>
    </div>
  </div>
</template>
