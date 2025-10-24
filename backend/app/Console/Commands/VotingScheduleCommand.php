<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;
use Carbon\Carbon;

class VotingScheduleCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'voting:schedule 
                            {action : The action to perform (start-church, end-church, start-national, end-national, status)}
                            {--date= : Optional date for scheduling (Y-m-d H:i:s format)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage voting schedules for church and national elections';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');
        $date = $this->option('date');

        switch ($action) {
            case 'start-church':
                $this->startVoting('church', $date);
                break;
            case 'end-church':
                $this->endVoting('church', $date);
                break;
            case 'start-national':
                $this->startVoting('national', $date);
                break;
            case 'end-national':
                $this->endVoting('national', $date);
                break;
            case 'status':
                $this->showStatus();
                break;
            default:
                $this->error('Invalid action. Use: start-church, end-church, start-national, end-national, or status');
                return 1;
        }

        return 0;
    }

    /**
     * Start voting for a specific category
     */
    private function startVoting(string $category, ?string $date = null)
    {
        $timestamp = $date ? Carbon::parse($date) : Carbon::now();
        
        Setting::set("{$category}_voting_start", $timestamp->toDateTimeString(), "Start time for {$category} voting");
        Setting::set("{$category}_voting_active", true, "Active status for {$category} voting");
        
        $this->info("✅ {$category} voting started at {$timestamp->format('Y-m-d H:i:s')}");
        
        // Log the action
        $this->logAction("Started {$category} voting", $timestamp);
    }

    /**
     * End voting for a specific category
     */
    private function endVoting(string $category, ?string $date = null)
    {
        $timestamp = $date ? Carbon::parse($date) : Carbon::now();
        
        Setting::set("{$category}_voting_end", $timestamp->toDateTimeString(), "End time for {$category} voting");
        Setting::set("{$category}_voting_active", false, "Active status for {$category} voting");
        
        $this->info("🛑 {$category} voting ended at {$timestamp->format('Y-m-d H:i:s')}");
        
        // Log the action
        $this->logAction("Ended {$category} voting", $timestamp);
    }

    /**
     * Show current voting status
     */
    private function showStatus()
    {
        $this->info('📊 Current Voting Status');
        $this->line('');

        // Church voting status
        $churchActive = Setting::get('church_voting_active', false);
        $churchStart = Setting::get('church_voting_start');
        $churchEnd = Setting::get('church_voting_end');

        $this->line('🏛️  Church Voting:');
        $this->line("   Status: " . ($churchActive ? '🟢 Active' : '🔴 Inactive'));
        if ($churchStart) {
            $this->line("   Started: {$churchStart}");
        }
        if ($churchEnd) {
            $this->line("   Ended: {$churchEnd}");
        }
        $this->line('');

        // National voting status
        $nationalActive = Setting::get('national_voting_active', false);
        $nationalStart = Setting::get('national_voting_start');
        $nationalEnd = Setting::get('national_voting_end');

        $this->line('🏛️  National Voting:');
        $this->line("   Status: " . ($nationalActive ? '🟢 Active' : '🔴 Inactive'));
        if ($nationalStart) {
            $this->line("   Started: {$nationalStart}");
        }
        if ($nationalEnd) {
            $this->line("   Ended: {$nationalEnd}");
        }
        $this->line('');

        // Overall system status
        $anyActive = $churchActive || $nationalActive;
        $this->line('🌐 System Status: ' . ($anyActive ? '🟢 Voting in Progress' : '🔴 No Active Voting'));
    }

    /**
     * Log voting actions for audit trail
     */
    private function logAction(string $action, Carbon $timestamp)
    {
        $logEntry = [
            'action' => $action,
            'timestamp' => $timestamp->toDateTimeString(),
            'executed_by' => 'system_cron',
            'executed_at' => Carbon::now()->toDateTimeString()
        ];

        // Get existing logs
        $existingLogs = Setting::get('voting_schedule_logs', '[]');
        $logs = json_decode($existingLogs, true) ?: [];
        
        // Add new log entry
        $logs[] = $logEntry;
        
        // Keep only last 100 entries
        if (count($logs) > 100) {
            $logs = array_slice($logs, -100);
        }
        
        // Save back to settings
        Setting::set('voting_schedule_logs', json_encode($logs), 'Voting schedule action logs');
    }
}