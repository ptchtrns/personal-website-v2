<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Resources\PostResource;

class PostController extends Controller
{
    // Fetch all posts
    public function index()
    {
        return PostResource::collection(Post::all());
    }

    // Fetch a single post by ID
    public function show($id)
    {
        $post = Post::findOrFail($id);
        return new PostResource($post);
    }
}
