<?php

namespace App\Services;

use GuzzleHttp\Client;

class PaystackService
{
    protected Client $http;
    protected string $secretKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->http = new Client();
        $this->secretKey = config('paystack.secretKey') ?? env('PAYSTACK_SECRET_KEY');
        $this->baseUrl = 'https://api.paystack.co';
    }

    public function convertToKobo(float $amountGhc): int
    {
        return (int) round($amountGhc * 100);
    }

    public function initializeTransaction(array $data): array
    {
        $response = $this->http->post($this->baseUrl . '/transaction/initialize', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Accept' => 'application/json',
            ],
            'json' => $data,
            'http_errors' => false,
        ]);

        $body = json_decode((string) $response->getBody(), true);
        return $body ?? [];
    }

    public function verifyTransaction(string $reference): array
    {
        $response = $this->http->get($this->baseUrl . '/transaction/verify/' . $reference, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Accept' => 'application/json',
            ],
            'http_errors' => false,
        ]);

        $body = json_decode((string) $response->getBody(), true);
        return $body ?? [];
    }
}