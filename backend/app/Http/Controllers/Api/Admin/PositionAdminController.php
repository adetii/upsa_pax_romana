<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Cache;

class PositionAdminController extends Controller
{
    public function index()
    {
        // Return positions directly without caching
        $positions = Position::with('category')
            ->orderBy('display_order')
            ->orderBy('name')
            ->get()
            ->map(function ($position) {
                return [
                    'id' => $position->id,
                    'name' => $position->name,
                    'category_id' => $position->category_id,
                    'category' => $position->category,
                    'created_at' => $position->created_at,
                    'updated_at' => $position->updated_at,
                ];
            });

        return response()->json($positions);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', Rule::exists('categories', 'id')],
            'description' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();

        $position = Position::create($data);

        // Cache busting for related keys (admin list caching removed)
        Cache::forget('voting:positions:category:' . $position->category_id);
        Cache::forget('results:public:category:' . $position->category_id);
        Cache::forget('results:admin:category:' . $position->category_id);
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');
        Cache::forget('voting:candidates:position:' . $position->id);

        return response()->json($position, 201);
    }

    public function update(Request $request, int $id)
    {
        $position = Position::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'category_id' => ['sometimes', Rule::exists('categories', 'id')],
            'description' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer'],
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();

        // Track original relations before update
        $originalCategoryId = $position->category_id;

        $position->update($data);

        // Bust caches for original category and position
        Cache::forget('voting:positions:category:' . $originalCategoryId);
        Cache::forget('results:public:category:' . $originalCategoryId);
        Cache::forget('results:admin:category:' . $originalCategoryId);
        Cache::forget('voting:candidates:position:' . $position->id);
        Cache::forget('results:public:position:' . $position->id);
        Cache::forget('results:admin:position:' . $position->id);

        // If category changed, bust caches for new category as well
        if ($position->category_id !== $originalCategoryId) {
            Cache::forget('voting:positions:category:' . $position->category_id);
            Cache::forget('results:public:category:' . $position->category_id);
            Cache::forget('results:admin:category:' . $position->category_id);
        }

        // Bust aggregate caches
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');

        return response()->json($position);
    }

    public function destroy(int $id)
    {
        $position = Position::findOrFail($id);
        $categoryId = $position->category_id;
        $positionId = $position->id;

        $position->delete();

        // Bust caches for related keys
        Cache::forget('voting:candidates:position:' . $positionId);
        Cache::forget('results:public:position:' . $positionId);
        Cache::forget('results:admin:position:' . $positionId);
        Cache::forget('voting:positions:category:' . $categoryId);
        Cache::forget('results:public:category:' . $categoryId);
        Cache::forget('results:admin:category:' . $categoryId);
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');

        return response()->json(['message' => 'Position deleted']);
    }
}