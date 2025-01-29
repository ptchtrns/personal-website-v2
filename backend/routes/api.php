<?php

use App\Http\Resources\CategoryResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Post;

Route::get('/users', function () {
  return UserResource::collection(User::all());
});

Route::get('/posts', function () {
  return PostResource::collection(Post::all());
});

Route::get('/categories', function () {
  return CategoryResource::collection(Category::all());
});