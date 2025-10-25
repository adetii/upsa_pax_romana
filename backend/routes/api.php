<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\PublicResultsController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ResultsController;
use App\Http\Controllers\Api\Admin\CandidateAdminController;
use App\Http\Controllers\Api\Admin\PositionAdminController;
use App\Http\Controllers\Api\Admin\TransactionController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\ExportController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\CategoryAdminController;
use App\Http\Controllers\Api\VotingStatusController;
use App\Http\Controllers\Api\WebhookController;

// Base API route
Route::get('/', function () {
    return response()->json([
        'message' => 'St. Greg Voting System API',
        'version' => '1.0',
        'status' => 'active',
        'endpoints' => [
            'categories' => '/api/categories',
            'results' => '/api/results',
            'vote' => '/api/vote/initialize',
            'admin' => '/api/admin/entry_255081'
        ]
    ]);
});

// Public APIs
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{categoryId}/positions', [PositionController::class, 'byCategory']);
Route::get('/positions/{positionId}/candidates', [CandidateController::class, 'byPosition']);
Route::get('/public/results', [PublicResultsController::class, 'index']);

// Voting status (public endpoint)
Route::get('/voting/status', [VotingStatusController::class, 'status']);

Route::post('/vote/initialize', [VoteController::class, 'initialize'])->middleware(['throttle:vote', \Illuminate\Session\Middleware\StartSession::class]);
Route::post('/vote/verify', [VoteController::class, 'verify'])->middleware('throttle:vote');

// Webhook endpoints (no authentication required)
Route::post('/webhook/paystack', [WebhookController::class, 'paystackWebhook']);
Route::get('/payment/success', [WebhookController::class, 'paymentSuccess'])->middleware([\Illuminate\Session\Middleware\StartSession::class]);

// Admin Auth - entry_255081 needs conditional session for OTP verification only
// Ensure cookies are encrypted and queued so the session cookie is actually set on OTP verification
Route::post('/admin/entry_255081', [AuthController::class, 'entry_255081'])
    ->middleware([
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \App\Http\Middleware\ConditionalSession::class,
    ]);

Route::post('/admin/fg-pw_255081', [AuthController::class, 'forgotPassword']);
Route::post('/admin/set-pw_255081', [AuthController::class, 'resetPassword']);

// Admin Protected routes
Route::middleware([\Illuminate\Cookie\Middleware\EncryptCookies::class, \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class, \Illuminate\Session\Middleware\StartSession::class, \Illuminate\View\Middleware\ShareErrorsFromSession::class, 'auth:web'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);

    Route::get('/admin/results', [ResultsController::class, 'index']);
    Route::get('/admin/export/results', [ExportController::class, 'results']);

    // Settings (super admin only)
    Route::get('/admin/settings/public-results', [SettingsController::class, 'showPublicResults']);
    Route::put('/admin/settings/public-results', [SettingsController::class, 'updatePublicResults']);
    
    // Voting lock settings (super admin only)
    Route::put('/admin/voting/lock-messages', [VotingStatusController::class, 'updateLockMessages']);
    Route::post('/admin/voting/toggle', [VotingStatusController::class, 'toggleVoting']);

    // Candidates
    Route::get('/admin/candidates', [CandidateAdminController::class, 'index']);
    Route::post('/admin/candidates', [CandidateAdminController::class, 'store']);
    Route::put('/admin/candidates/{id}', [CandidateAdminController::class, 'update']);
    Route::delete('/admin/candidates/{id}', [CandidateAdminController::class, 'destroy']);

    // Positions
    Route::get('/admin/positions', [PositionAdminController::class, 'index']);
    Route::post('/admin/positions', [PositionAdminController::class, 'store']);
    Route::put('/admin/positions/{id}', [PositionAdminController::class, 'update']);
    Route::delete('/admin/positions/{id}', [PositionAdminController::class, 'destroy']);

    // Categories
    Route::get('/admin/categories', [CategoryAdminController::class, 'index']);
    Route::post('/admin/categories', [CategoryAdminController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryAdminController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryAdminController::class, 'destroy']);

    // Transactions
    Route::get('/admin/transactions', [TransactionController::class, 'index']);

    // Admin users (super admin only)
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users', [AdminUserController::class, 'store']);
    Route::put('/admin/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);

    // Session-aware profile
    Route::get('/admin/profile', [AuthController::class, 'profile']);
    Route::put('/admin/profile', [AuthController::class, 'updateProfile']);
});

// Logout route - no session middleware to prevent cookie recreation
Route::post('/admin/logout', [AuthController::class, 'logout']);