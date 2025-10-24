<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Cache;

class CandidateAdminController extends Controller
{
    public function index()
    {
        // Return candidates directly without caching
        $candidates = Candidate::with('position')
            ->withSum('votes', 'vote_count')
            ->orderBy('name')
            ->get()
            ->map(function ($candidate) {
                return [
                    'id' => $candidate->id,
                    'name' => $candidate->name,
                    'bio' => $candidate->bio,
                    'photo_url' => $candidate->photo_url,
                    'position_id' => $candidate->position_id,
                    'status' => $candidate->status,
                    'vote_count' => $candidate->votes_sum_vote_count ?? 0,
                    'position' => $candidate->position,
                    'created_at' => $candidate->created_at,
                    'updated_at' => $candidate->updated_at,
                ];
            });

        return response()->json($candidates);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'position_id' => ['required', Rule::exists('positions', 'id')],
            'photo' => ['required', 'image', 'mimes:jpeg,png', 'max:2048'],
            'bio' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();

        $path = $request->file('photo')->store('candidates', 'public');

        $candidate = Candidate::create([
            'name' => $data['name'],
            'position_id' => $data['position_id'],
            'photo_url' => asset('storage/' . $path),
            'bio' => $data['bio'] ?? null,
            'status' => $data['status'],
        ]);

        // Bust caches affected by new candidate
        $positionId = $candidate->position_id;
        $categoryId = optional(Position::find($positionId))->category_id;
        Cache::forget('dashboard:summary');
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');
        
        Cache::forget('voting:candidates:position:' . $positionId);
        Cache::forget('results:public:position:' . $positionId);
        Cache::forget('results:admin:position:' . $positionId);
        if ($categoryId) {
            Cache::forget('results:public:category:' . $categoryId);
            Cache::forget('results:admin:category:' . $categoryId);
        }

        return response()->json($candidate, 201);
    }

    public function update(Request $request, int $id)
    {
        $candidate = Candidate::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'position_id' => ['sometimes', Rule::exists('positions', 'id')],
            'photo' => ['sometimes', 'image', 'mimes:jpeg,png', 'max:2048'],
            'bio' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();

        if (isset($data['photo'])) {
            $path = $request->file('photo')->store('candidates', 'public');
            $data['photo_url'] = asset('storage/' . $path);
            unset($data['photo']);
        }

        $originalPositionId = $candidate->position_id;
        $candidate->update($data);
        $newPositionId = $candidate->position_id;

        // Bust caches for original position
        $origCategoryId = optional(Position::find($originalPositionId))->category_id;
        Cache::forget('dashboard:summary');
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');
        Cache::forget('voting:candidates:position:' . $originalPositionId);
        Cache::forget('results:public:position:' . $originalPositionId);
        Cache::forget('results:admin:position:' . $originalPositionId);
        if ($origCategoryId) {
            Cache::forget('results:public:category:' . $origCategoryId);
            Cache::forget('results:admin:category:' . $origCategoryId);
        }

        // If position changed, also bust caches for new position
        if ($newPositionId !== $originalPositionId) {
            $newCategoryId = optional(Position::find($newPositionId))->category_id;
            Cache::forget('voting:candidates:position:' . $newPositionId);
            Cache::forget('results:public:position:' . $newPositionId);
            Cache::forget('results:admin:position:' . $newPositionId);
            if ($newCategoryId) {
                Cache::forget('results:public:category:' . $newCategoryId);
                Cache::forget('results:admin:category:' . $newCategoryId);
            }
        }

        

        return response()->json($candidate);
    }

    public function destroy(int $id)
    {
        $candidate = Candidate::findOrFail($id);
        $positionId = $candidate->position_id;
        $categoryId = optional(Position::find($positionId))->category_id;

        $candidate->delete();

        // Bust caches affected by deletion
        Cache::forget('dashboard:summary');
        Cache::forget('results:public:all');
        Cache::forget('results:admin:all');
        
        Cache::forget('voting:candidates:position:' . $positionId);
        Cache::forget('results:public:position:' . $positionId);
        Cache::forget('results:admin:position:' . $positionId);
        if ($categoryId) {
            Cache::forget('results:public:category:' . $categoryId);
            Cache::forget('results:admin:category:' . $categoryId);
        }

        return response()->json(['message' => 'Candidate deleted']);
    }
}