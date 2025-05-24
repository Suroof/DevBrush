<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useTitle } from "@vueuse/core";
import { ElForm, ElMessage, ElFormItem, ElInput, ElButton, ElAlert, ElDivider } from "element-plus";
import type { FormRules } from "element-plus";
import { Lock, User, Message, Monitor } from "@element-plus/icons-vue";
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
    console.log('Fetching captcha...');

    // 使用 POST 请求，并确保 httpClient 支持 POST
    const response = await httpClient.post<{ data: string }>('/user/captcha', {});

    console.log('Response:', response);

    if (response && response.data) {
      captchaUrl.value = response.data;
      console.log('Captcha URL set:', captchaUrl.value);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    console.error('Error fetching captcha:', err);

    if (err instanceof Error) {
      ElMessage.error(`获取验证码失败: ${err.message}`);
    } else {
      ElMessage.error('获取验证码失败: 未知错误');
    }
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
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 relative overflow-hidden"
  >
    <!-- 装饰元素 -->
    <div class="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div class="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-8 left-20 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    
    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-white rounded-full shadow-md inline-flex items-center justify-center">
            <Monitor class="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          DevDeck
        </h2>
        <h3 class="mt-1 text-center text-xl font-bold text-gray-700">
          创建您的账户
        </h3>
        <p class="mt-2 text-center text-sm text-gray-600">
          或
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
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
        class="mb-4 rounded-md"
      />

      <ElForm
        ref="formRef"
        :model="registerForm"
        :rules="rules"
        class="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-80 border border-gray-100 transition-all duration-300 hover:shadow-xl"
      >
        <ElFormItem prop="username" class="mb-5">
          <ElInput
            v-model="registerForm.username"
            :prefix-icon="User"
            placeholder="用户名"
            autocomplete="username"
            class="rounded-lg"
          />
        </ElFormItem>

        <ElFormItem prop="email" class="mb-5">
          <ElInput
            v-model="registerForm.email"
            :prefix-icon="Message"
            placeholder="邮箱"
            autocomplete="email"
            class="rounded-lg"
          />
        </ElFormItem>

        <ElFormItem prop="password" class="mb-5">
          <ElInput
            v-model="registerForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
            autocomplete="new-password"
            show-password
            class="rounded-lg"
          />
        </ElFormItem>

        <ElFormItem prop="confirmPassword" class="mb-5">
          <ElInput
            v-model="registerForm.confirmPassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="确认密码"
            autocomplete="new-password"
            show-password
            class="rounded-lg"
          />
        </ElFormItem>

        <ElFormItem prop="captcha" class="mb-6">
          <div class="flex items-center">
            <ElInput
              v-model="registerForm.captcha"
              placeholder="验证码"
              class="flex-1 rounded-lg"
            />
            <img
              :src="captchaUrl"
              alt="验证码"
              class="ml-2 h-10 cursor-pointer rounded-md border border-gray-200 hover:border-indigo-300 transition-all duration-200"
              @click="fetchCaptcha"
            />
          </div>
        </ElFormItem>
        <div>
          <ElButton
            type="primary"
            class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
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

<style scoped>
.animate-blob {
  animation: blob-bounce 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob-bounce {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>
