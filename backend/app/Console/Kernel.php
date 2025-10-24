<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Example scheduled tasks for voting management
        // These can be customized based on specific requirements
        
        // Check and update voting status every minute during active periods
        $schedule->command('voting:schedule status')
                 ->everyMinute()
                 ->withoutOverlapping()
                 ->runInBackground();

        // Example: Auto-start church voting every Sunday at 8:00 AM
        // $schedule->command('voting:schedule start-church')
        //          ->weeklyOn(0, '08:00'); // 0 = Sunday

        // Example: Auto-end church voting every Sunday at 6:00 PM
        // $schedule->command('voting:schedule end-church')
        //          ->weeklyOn(0, '18:00'); // 0 = Sunday

        // Example: Auto-start national voting on specific dates
        // $schedule->command('voting:schedule start-national')
        //          ->monthlyOn(1, '08:00'); // 1st of every month at 8:00 AM

        // Example: Auto-end national voting on specific dates
        // $schedule->command('voting:schedule end-national')
        //          ->monthlyOn(1, '18:00'); // 1st of every month at 6:00 PM

        // Clean up old logs weekly
        $schedule->call(function () {
            \App\Models\Setting::where('key', 'voting_schedule_logs')
                ->where('updated_at', '<', now()->subWeeks(4))
                ->delete();
        })->weekly();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}