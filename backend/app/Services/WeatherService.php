<?php

namespace App\Services;

use App\Exceptions\CityNotFoundException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class WeatherService
{
    private string $baseUrl;

    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.openweather.base_url'), '/');
        $this->apiKey = (string) config('services.openweather.key');
    }

    /**
     * Fetch and normalize current weather for a given city name.
     *
     * @return array<string, mixed>
     *
     * @throws CityNotFoundException
     * @throws RuntimeException
     */
    public function getCurrentWeather(string $city): array
    {
        if ($this->apiKey === '' || $this->apiKey === 'mock') {
            return $this->getMockWeather($city);
        }

        $cacheKey = 'weather:'.mb_strtolower(trim($city));

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($city) {
            $response = Http::timeout(8)->get("{$this->baseUrl}/weather", [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => 'metric',
            ]);

            if ($response->status() === 404) {
                throw new CityNotFoundException($city);
            }

            if ($response->failed()) {
                throw new RuntimeException('The weather provider is currently unavailable. Please try again shortly.');
            }

            return $this->normalize($response->json());
        });
    }

    /**
     * Generate stable mock weather data based on the city name.
     *
     * @return array<string, mixed>
     */
    private function getMockWeather(string $city): array
    {
        // Stable random values based on city name hash
        $hash = crc32(mb_strtolower(trim($city)));
        mt_srand($hash);

        $conditions = [
            ['Clear', 'clear sky', '01d'],
            ['Clouds', 'few clouds', '02d'],
            ['Clouds', 'scattered clouds', '03d'],
            ['Clouds', 'broken clouds', '04d'],
            ['Rain', 'light rain', '10d'],
            ['Rain', 'moderate rain', '10d'],
            ['Thunderstorm', 'thunderstorm with rain', '11d'],
            ['Snow', 'light snow', '13d'],
            ['Mist', 'mist', '50d'],
            ['Haze', 'haze', '50d'],
        ];

        $cond = $conditions[abs($hash) % count($conditions)];
        
        $temp = round(mt_rand(-50, 450) / 10, 1); // -5.0 to 45.0
        $feelsLike = round($temp + mt_rand(-30, 30) / 10, 1);
        $humidity = mt_rand(10, 100);
        $windSpeed = round(mt_rand(0, 150) / 10, 1);

        // Reset seed to random
        mt_srand();

        return [
            'city' => ucwords(trim($city)),
            'country' => 'MOCK',
            'temperature' => $temp,
            'feels_like' => $feelsLike,
            'humidity' => $humidity,
            'wind_speed' => $windSpeed,
            'condition' => $cond[0],
            'description' => $cond[1],
            'icon' => $cond[2],
            'fetched_at' => now()->toIso8601String(),
        ];
    }

    /**
     * Reshape OpenWeather's payload into the flat structure the frontend consumes.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function normalize(array $payload): array
    {
        $weather = $payload['weather'][0] ?? [];
        $main = $payload['main'] ?? [];
        $wind = $payload['wind'] ?? [];

        return [
            'city' => $payload['name'] ?? '',
            'country' => $payload['sys']['country'] ?? null,
            'temperature' => $main['temp'] ?? null,
            'feels_like' => $main['feels_like'] ?? null,
            'humidity' => $main['humidity'] ?? null,
            'wind_speed' => $wind['speed'] ?? null,
            'condition' => $weather['main'] ?? 'Unknown',
            'description' => $weather['description'] ?? '',
            'icon' => $weather['icon'] ?? '01d',
            'fetched_at' => now()->toIso8601String(),
        ];
    }
}
