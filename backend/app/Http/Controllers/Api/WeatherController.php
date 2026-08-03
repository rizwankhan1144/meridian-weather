<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\CityNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\WeatherRequest;
use App\Services\WeatherService;
use RuntimeException;

class WeatherController extends Controller
{
    public function __construct(private readonly WeatherService $weather)
    {
    }

    /**
     * Return current weather conditions for the requested city.
     */
    public function show(WeatherRequest $request)
    {
        try {
            $data = $this->weather->getCurrentWeather($request->validated('city'));

            return response()->json([
                'data' => $data,
            ]);
        } catch (CityNotFoundException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 503);
        }
    }
}
