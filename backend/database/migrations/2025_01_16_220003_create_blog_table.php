<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name')->unique();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title'); // Title of the blog post
            $table->string('slug')->unique(); // URL-friendly version of the title
            $table->text('excerpt')->nullable(); // Short summary of the blog post
            $table->text('content'); // Content of the blog post
            $table->timestamp('published_at')->nullable();
            $table->string('status')->default('draft'); // Status of the blog post (draft, published, etc.)
            $table->string('featured_image')->nullable(); // Path to the featured image
            $table->string('tags')->nullable(); // Comma-separated tags for the blog post
            $table->string('seo_title')->nullable(); // SEO-specific title
            $table->text('meta_description')->nullable(); // SEO meta description
        });

        Schema::create('posts_categories', function (Blueprint $table) {
          $table->id();
          $table->foreignId('post_id')->constrained('posts')->onDelete('cascade'); // References the blog table
          $table->foreignId('category_id')->constrained('categories')->onDelete('cascade'); // References the categories table
          $table->unique(['post_id', 'category_id']); // Ensures no duplicate associations
      });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('posts_categories');
    }
};
