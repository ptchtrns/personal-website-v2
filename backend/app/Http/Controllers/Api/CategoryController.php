<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    // Fetch all posts
    public function index()
    {
        return CategoryResource::collection(Category::all());
    }

    // Fetch a single post by ID
    public function show($id)
    {
        $post = Category::findOrFail($id);
        return new CategoryResource($post);
    }
}
