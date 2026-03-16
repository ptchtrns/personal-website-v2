<template>
  <MainDisplay>
    <div class="border border-stone-300 dark:border-stone-600 rounded-lg p-4 w-full">
        <h2 class="text-xl mb-2">Login</h2>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">        
            <div class="flex flex-col gap-1.5">
                <label for="password">Password</label>
                <input 
                id="password"
                v-model="form.password"
                type="password" 
                name="password"
                placeholder="Enter password"
                required
                class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
                />
            </div>
        
            <div v-if="error" class="error-message">{{ error }}</div>
        
            <button 
                type="submit" 
                :disabled="loading"
                class="bg-stone-800 text-white p-1.5 rounded-lg"
            >
                {{ loading ? 'Loading...' : 'Log in' }}
            </button>
        </form>
    </div>
  </MainDisplay>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import MainDisplay from '@/components/layout/MainDisplay.vue';
import api from '@/lib/api';

const router = useRouter();
const form = reactive({
  password: "",
});

const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    await api.post("/login", form, { withCredentials: true });

    // Reset form on success
    form.password = '';
    
    // Redirect to admin page
    router.push('/admin');
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Failed to log in';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.error-message {
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #991b1b;
  font-size: 0.875rem;
}
</style>
