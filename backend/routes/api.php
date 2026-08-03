<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WeatherController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\VerificationController;

// Public authentication endpoints.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Email verification endpoints.
Route::post('/verify-email', [VerificationController::class, 'verify']);
Route::post('/resend-verification-code', [VerificationController::class, 'resend'])->middleware('throttle:1,1');

// Everything below requires a valid JWT (Authorization: Bearer <token>).
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/weather', [WeatherController::class, 'show']);
});
