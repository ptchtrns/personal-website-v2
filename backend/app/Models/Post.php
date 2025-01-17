<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'posts';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'published_at',
        'status',
        'featured_image',
        'tags',
        'seo_title',
        'meta_description',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * Scope a query to only include published posts.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')->whereNotNull('published_at');
    }

    /**
     * Scope a query to search posts by a keyword.
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('title', 'like', "%{$keyword}%")
            ->orWhere('content', 'like', "%{$keyword}%");
    }

    /**
     * Define the many-to-many relationship with Category.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'posts_categories');
    }

    /**
     * Check if the post is published.
     */
    public function isPublished()
    {
        return $this->status === 'published' && $this->published_at <= now();
    }
}
