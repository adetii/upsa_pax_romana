<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Cache;

class CategoryAdminController extends Controller
{
    public function index()
    {
        // Return categories directly without caching
        $categories = Category::orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'created_at' => $category->created_at,
                    'updated_at' => $category->updated_at,
                ];
            });

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $category = Category::create($data);

        // Bust caches for this category and aggregates (admin list caching removed)
        Cache::forget('voting:positions:category:' . $category->id);
        Cache::forget('results:public:category:' . $category->id);
        Cache::forget('results:admin:category:' . $category->id);
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');
        Cache::forget('dashboard:summary');

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($id)],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $category->update($data);

        // Bust caches for this category and aggregates (admin list caching removed)
        Cache::forget('voting:positions:category:' . $category->id);
        Cache::forget('results:public:category:' . $category->id);
        Cache::forget('results:admin:category:' . $category->id);
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');
        Cache::forget('dashboard:summary');

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Check if category has associated positions
        if ($category->positions()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete category with associated positions'
            ], 422);
        }

        $categoryId = $category->id;
        $category->delete();

        // Bust caches for this category and aggregates (admin list caching removed)
        Cache::forget('voting:positions:category:' . $categoryId);
        Cache::forget('results:public:category:' . $categoryId);
        Cache::forget('results:admin:category:' . $categoryId);
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');
        Cache::forget('dashboard:summary');

        return response()->json(['message' => 'Category deleted successfully']);
    }
}