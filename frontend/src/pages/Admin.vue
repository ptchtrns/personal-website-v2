<template>
  <MainDisplay>
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
        <FieldSet>
          <FieldGroup>
            <Field class="flex flex-col gap-1.5">
                <FieldLabel for="image">Image File</FieldLabel>
                <Input 
                  id="image"
                  type="file" 
                  name="image" 
                  @change="handleFileChange"
                  accept="image/jpeg"
                  required
                />
            </Field>
          </FieldGroup>
        
            <Field>
                <FieldLabel for="aspect_ratio">Aspect Ratio</FieldLabel>
                <Select>
                  <SelectTrigger
                    default-value=""
                    id="aspect_ratio"
                    name="aspect_ratio"
                    v-model="form.aspect_ratio"
                  >
                    <SelectValue placeholder="Select a aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16/9">
                      16:9
                    </SelectItem>
                    <SelectItem value="4/3">
                      4:3
                    </SelectItem>
                    <SelectItem value="3/2">
                      3:2
                    </SelectItem>
                    <SelectItem value="4/5">
                      4:5
                    </SelectItem>
                  </SelectContent>
                </Select>
            </Field>
        
            <Field>
                <FieldLabel for="title">Title</FieldLabel>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Image title"
                  v-model="form.title"
                  required
                />
            </Field>
        
            <Field>
                <FieldLabel for="description">Description</FieldLabel>
                <Textarea 
                id="description"
                v-model="form.description"
                name="description"
                placeholder="Image description"
                rows="4"
                class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
                />
            </Field>
        
            <div v-if="error" class="p-3 bg-red-100 border border-red-300 rounded text-red-900 text-sm">{{ error }}</div>
        
            <div v-if="success" class="p-3 bg-green-100 border border-green-300 rounded text-green-900 text-sm">{{ success }}</div>
        
            <button 
                type="submit" 
                :disabled="loading"
                class="bg-stone-800 text-white p-1.5 rounded-lg"
            >
                {{ loading ? 'Uploading...' : 'Upload Image' }}
            </button>
        </FieldSet>
      </form>
    </Card>
  </MainDisplay>
</template>


<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import MainDisplay from '@/components/layout/MainDisplay.vue';
import api from '@/lib/api';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
} from '@/components/ui/field'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const form = reactive({
  image: null,
  aspect_ratio: '',
  title: '',
  description: '',
});

const loading = ref(false);
const error = ref('');
const success = ref('');

const handleFileChange = (event) => {
  form.image = event.target.files[0] || null;
};

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    if (!form.image) {
      throw new Error('Please select an image');
    }

    const { image, ...formData } = form;

    console.log(image);

    const res = await api.post('/photos', formData);
    await axios.put(res.data.presigned_url, image, { headers: { 'Content-Type': image.type, 'X-Amz-Tagging': 'OriginalPhoto=True' } });

    // Reset form on success
    form.image = null;
    form.aspect_ratio = '';
    form.title = '';
    form.description = '';
    
    success.value = 'Image uploaded successfully!';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Failed to upload image';
  } finally {
    loading.value = false;
  }
};
</script>
