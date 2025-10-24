<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key', 'value', 'description'
    ];

    public static function get(string $key, $default = null)
    {
        $raw = Cache::remember('settings:' . $key, now()->addMinutes(5), function () use ($key) {
            return static::where('key', $key)->value('value');
        });

        return $raw !== null ? static::castValue($raw) : $default;
    }

    public static function set(string $key, $value, ?string $description = null)
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            ['value' => is_bool($value) ? ($value ? 'true' : 'false') : (string) $value, 'description' => $description]
        );

        Cache::forget('settings:' . $key);

        return $setting;
    }

    protected static function castValue(?string $value)
    {
        if ($value === null) return null;
        $lower = strtolower(trim($value));
        if (in_array($lower, ['true', 'false'], true)) {
            return $lower === 'true';
        }
        return $value;
    }
}