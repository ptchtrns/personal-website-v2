<template>
  <MainDisplay>
    <Card>
      <CardHeader>
        <CardTitle>Image upload</CardTitle>
        <CardDescription>Upload and manage your photos and audio files.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs default-value="photos">
          <TabsList>
            <TabsTrigger value="photos">
              Photos
            </TabsTrigger>
            <TabsTrigger value="audio">
              Audio
            </TabsTrigger>
          </TabsList>
          <TabsContent value="photos">
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
              
                  <Button type="submit" :disabled="loading" class="w-full" variant="ghost">
                    {{ loading ? 'Uploading...' : 'Upload Image' }}
                  </Button>
              </FieldSet>
            </form>
          </TabsContent>
          <TabsContent value="audio">
            Audio
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </MainDisplay>
</template>


<script setup>
import { reactive, ref } from 'vue';
import MainDisplay from '@/components/layout/MainDisplay.vue';
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
import CardContent from '@/components/ui/card/CardContent.vue';
import { Button } from '@/components/ui/button';
import Tabs from '@/components/ui/tabs/Tabs.vue';
import TabsList from '@/components/ui/tabs/TabsList.vue';
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue';
import TabsContent from '@/components/ui/tabs/TabsContent.vue';

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

    const res = await fetch('api/photos', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to upload image');
    }
    const { presigned_url } = await res.json();
    await fetch(presigned_url, {
      method: 'PUT',
      headers: { 'Content-Type': image.type, 'X-Amz-Tagging': 'OriginalPhoto=True' },
      body: image,
    });

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
    error.value = err.message || 'Failed to upload image';
  } finally {
    loading.value = false;
  }
};
</script>
