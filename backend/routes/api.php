<?php

use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Post;

Route::get('/users', function () {
  return UserResource::collection(User::all());
});

Route::get('/posts', function () {
  return PostResource::collection(Post::all());
});