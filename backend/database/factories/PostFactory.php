<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    /**
     * The name of the model that this factory is for.
     *
     * @var string
     */
    protected $model = \App\Models\Post::class;

    /**
     * Define the model's default state.
     */
    public function definition()
    {
        $title = $this->faker->sentence; // Generate a random title

        return [
            'title' => $title,
            'slug' => Str::slug($title), // Generate a slug based on the title
            'excerpt' => $this->faker->text(100), // Generate a short excerpt
            'content' => $this->faker->paragraphs(5, true), // Generate multiple paragraphs
            'published_at' => $this->faker->boolean(70) ? now() : null, // 70% chance of being published
            'status' => $this->faker->randomElement(['draft', 'published']), // Random status
            'featured_image' => $this->faker->imageUrl(800, 600, 'blog', true), // Random image URL
            'tags' => implode(',', $this->faker->words(5)), // Comma-separated random tags
            'seo_title' => $title, // Use the title as the SEO title
            'meta_description' => $this->faker->sentence(20), // Random meta description
        ];
    }
}
