<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->file(public_path('spa/index.html'));
});

// SPA fallback: send all non-API routes to the frontend
Route::get('/{any}', function () {
    return response()->file(public_path('spa/index.html'));
})->where('any', '^(?!api).*$');

// CSRF token endpoint for SPA (starts session and returns token)
Route::prefix('api')->get('/csrf', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});
