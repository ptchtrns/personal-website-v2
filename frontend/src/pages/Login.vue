<template>
  <MainDisplay>
    <div class="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel for="password">Password</FieldLabel>
                  <Input
                    id="password"
                    v-model="form.password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required
                  />
                  <FieldError v-if="error">{{ error }}</FieldError>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button type="submit" :disabled="loading" class="w-full" variant="ghost">
              {{ loading ? 'Loading...' : 'Log in' }}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </MainDisplay>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import MainDisplay from '@/components/layout/MainDisplay.vue';
import { Input } from '@/components/ui/input';
import { FieldSet, FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    const res = await fetch('api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to log in');
    }

    form.password = '';
    router.push('/admin');
  } catch (err) {
    error.value = err.message || 'Failed to log in';
  } finally {
    loading.value = false;
  }
};
</script>
