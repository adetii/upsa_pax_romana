<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', env('FRONTEND_URL', 'http://localhost:5173'))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Changed to * to allow all headers
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // ✅ Changed to true - IMPORTANT!
];