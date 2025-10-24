# Voting Schedule Cron Job Setup

This document explains how to set up and use the automated voting schedule management system.

## Overview

The voting schedule system allows automatic management of church and national voting periods using Laravel's task scheduling and artisan commands.

## Files Created

1. **`app/Console/Commands/VotingScheduleCommand.php`** - Main command for managing voting schedules
2. **`app/Console/Kernel.php`** - Laravel's console kernel with scheduled tasks
3. **Database Settings** - Voting states stored in the `settings` table

## Available Commands

### Manual Commands

```bash
# Check current voting status
php artisan voting:schedule status

# Start church voting (immediately)
php artisan voting:schedule start-church

# End church voting (immediately)
php artisan voting:schedule end-church

# Start national voting (immediately)
php artisan voting:schedule start-national

# End national voting (immediately)
php artisan voting:schedule end-national

# Schedule for specific date/time
php artisan voting:schedule start-church --date="2025-12-25 08:00:00"
php artisan voting:schedule end-church --date="2025-12-25 18:00:00"
```

## Automated Scheduling

### Current Schedule (in `app/Console/Kernel.php`)

- **Status Check**: Runs every minute to monitor voting status
- **Log Cleanup**: Weekly cleanup of old voting logs

### Customizable Schedules (Examples in Kernel.php)

```php
// Auto-start church voting every Sunday at 8:00 AM
$schedule->command('voting:schedule start-church')
         ->weeklyOn(0, '08:00'); // 0 = Sunday

// Auto-end church voting every Sunday at 6:00 PM
$schedule->command('voting:schedule end-church')
         ->weeklyOn(0, '18:00');

// Auto-start national voting on 1st of every month at 8:00 AM
$schedule->command('voting:schedule start-national')
         ->monthlyOn(1, '08:00');
```

## Setting Up Cron Job (Production)

### Linux/Unix Systems

Add this line to your crontab (`crontab -e`):

```bash
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
```

### Windows Systems

Create a batch file `run-scheduler.bat`:

```batch
@echo off
cd /d "C:\path\to\your\project"
php artisan schedule:run
```

Then set up Windows Task Scheduler to run this batch file every minute.

## Database Storage

Voting states are stored in the `settings` table with these keys:

- `church_voting_active` - Boolean: Church voting status
- `church_voting_start` - DateTime: Church voting start time
- `church_voting_end` - DateTime: Church voting end time
- `national_voting_active` - Boolean: National voting status
- `national_voting_start` - DateTime: National voting start time
- `national_voting_end` - DateTime: National voting end time
- `voting_schedule_logs` - JSON: Audit trail of voting actions

## Integration with Frontend

To integrate with your voting pages, check the voting status:

```php
// In your controllers
use App\Models\Setting;

$churchActive = Setting::get('church_voting_active', false);
$nationalActive = Setting::get('national_voting_active', false);

// Pass to frontend or use in middleware
```

## Security Considerations

1. **Command Access**: Only system administrators should have access to these commands
2. **Audit Trail**: All actions are logged in `voting_schedule_logs`
3. **Validation**: Commands validate dates and prevent invalid operations

## Troubleshooting

### Command Not Found
Ensure `app/Console/Kernel.php` exists and loads commands from the Commands directory.

### Schedule Not Running
1. Verify cron job is set up correctly
2. Check Laravel logs for errors
3. Ensure proper file permissions

### Status Not Updating
1. Check database connection
2. Verify `settings` table exists
3. Check for any database errors in logs

## Example Usage Scenarios

### Scenario 1: Weekly Church Elections
```bash
# Set up weekly church voting (Sundays 8 AM - 6 PM)
# Add to Kernel.php schedule method:
$schedule->command('voting:schedule start-church')->weeklyOn(0, '08:00');
$schedule->command('voting:schedule end-church')->weeklyOn(0, '18:00');
```

### Scenario 2: Monthly National Elections
```bash
# Set up monthly national voting (1st of month 8 AM - 8 PM)
# Add to Kernel.php schedule method:
$schedule->command('voting:schedule start-national')->monthlyOn(1, '08:00');
$schedule->command('voting:schedule end-national')->monthlyOn(1, '20:00');
```

### Scenario 3: Special Election Dates
```bash
# Schedule specific dates manually
php artisan voting:schedule start-national --date="2025-12-25 08:00:00"
php artisan voting:schedule end-national --date="2025-12-25 20:00:00"
```

## Monitoring and Logs

- Use `php artisan voting:schedule status` to check current state
- Logs are automatically maintained in the database
- Old logs are cleaned up weekly to prevent database bloat
- All actions include timestamps and execution details

This system provides a robust, automated way to manage voting periods while maintaining full audit trails and administrative control.