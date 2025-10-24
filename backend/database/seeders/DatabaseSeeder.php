<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Position;
use App\Models\Candidate;
use App\Models\Setting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin users
        User::updateOrCreate(['email' => 'admin@church.com'], [
            'name' => 'Admin User',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
        ]);
        User::updateOrCreate(['email' => 'super@church.com'], [
            'name' => 'Super Admin',
            'password' => Hash::make('Secure123!'),
            'role' => 'super_admin',
        ]);

        // Seed default settings
        Setting::updateOrCreate(['key' => 'public_results_enabled'], [
            'value' => env('PUBLIC_RESULTS_ENABLED', false) ? 'true' : 'false',
            'description' => 'Toggle public results visibility',
        ]);

        // Categories
        $church = Category::updateOrCreate(['name' => 'Church'], [
            'description' => 'Church positions',
            'status' => 'active',
        ]);
        $national = Category::updateOrCreate(['name' => 'National'], [
            'description' => 'National positions',
            'status' => 'active',
        ]);

        // Positions
        $pastor = Position::updateOrCreate(['name' => 'Pastor', 'category_id' => $church->id], [
            'description' => 'Lead pastor',
            'display_order' => 1,
            'status' => 'active',
        ]);
        $elder = Position::updateOrCreate(['name' => 'Elder', 'category_id' => $church->id], [
            'description' => 'Church elder',
            'display_order' => 2,
            'status' => 'active',
        ]);
        $deacon = Position::updateOrCreate(['name' => 'Deacon', 'category_id' => $church->id], [
            'description' => 'Church deacon',
            'display_order' => 3,
            'status' => 'active',
        ]);

        $president = Position::updateOrCreate(['name' => 'President', 'category_id' => $national->id], [
            'description' => 'Chief executive officer of the organization',
            'display_order' => 1,
            'status' => 'active',
        ]);
        $vicePresident = Position::updateOrCreate(['name' => 'Vice President', 'category_id' => $national->id], [
            'description' => 'Assists the president and acts in their absence',
            'display_order' => 2,
            'status' => 'active',
        ]);
        $generalSecretary = Position::updateOrCreate(['name' => 'General Secretary', 'category_id' => $national->id], [
            'description' => 'Manages administrative affairs and correspondence',
            'display_order' => 3,
            'status' => 'active',
        ]);
        $treasurer = Position::updateOrCreate(['name' => 'Treasurer', 'category_id' => $national->id], [
            'description' => 'Manages financial resources and accounts',
            'display_order' => 4,
            'status' => 'active',
        ]);
        $organizingSecretary = Position::updateOrCreate(['name' => 'Organizing Secretary', 'category_id' => $national->id], [
            'description' => 'Coordinates events and activities',
            'display_order' => 5,
            'status' => 'active',
        ]);
        $financialSecretary = Position::updateOrCreate(['name' => 'Financial Secretary', 'category_id' => $national->id], [
            'description' => 'Records financial transactions',
            'display_order' => 6,
            'status' => 'active',
        ]);
        $secretary = Position::updateOrCreate(['name' => 'Secretary', 'category_id' => $national->id], [
            'description' => 'National secretary',
            'display_order' => 7,
            'status' => 'active',
        ]);

        // Church Candidates (3 per position)
        // Pastor Candidates
        Candidate::updateOrCreate(['name' => 'Rev. John Mensah', 'position_id' => $pastor->id], [
            'bio' => 'Experienced pastor with 15 years of ministry. Known for his compassionate leadership and community outreach programs.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Pastor Sarah Osei', 'position_id' => $pastor->id], [
            'bio' => 'Dynamic leader with a heart for youth ministry and church growth. Holds a Master\'s in Theology.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Rev. Emmanuel Asante', 'position_id' => $pastor->id], [
            'bio' => 'Dedicated servant with expertise in biblical counseling and pastoral care. Strong advocate for community development.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);

        // Elder Candidates
        Candidate::updateOrCreate(['name' => 'Elder Samuel Kwame', 'position_id' => $elder->id], [
            'bio' => 'Faithful elder with 20 years of church service. Expert in church administration and spiritual guidance.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Elder Grace Adjei', 'position_id' => $elder->id], [
            'bio' => 'Wise counselor and prayer warrior. Known for her dedication to women\'s ministry and family support.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Elder Peter Boateng', 'position_id' => $elder->id], [
            'bio' => 'Experienced leader in church finance and strategic planning. Strong background in business management.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);

        // Deacon Candidates
        Candidate::updateOrCreate(['name' => 'Deacon Mary Amponsah', 'position_id' => $deacon->id], [
            'bio' => 'Dedicated servant with a heart for community service. Leads various outreach programs and charity initiatives.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Deacon Joseph Nkrumah', 'position_id' => $deacon->id], [
            'bio' => 'Faithful deacon with expertise in church maintenance and facility management. Committed to excellence in service.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Deacon Ruth Owusu', 'position_id' => $deacon->id], [
            'bio' => 'Compassionate leader in hospitality ministry. Known for organizing successful church events and fellowship programs.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);

        // National Candidates (3 per position)
        // President Candidates
        Candidate::updateOrCreate(['name' => 'Dr. Kwame Nkrumah Jr.', 'position_id' => $president->id], [
            'bio' => 'Visionary leader with 25 years of organizational management experience. PhD in Public Administration and proven track record in strategic development.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Prof. Akosua Frimpong', 'position_id' => $president->id], [
            'bio' => 'Distinguished academic and policy expert. Former university vice-chancellor with extensive experience in institutional leadership and reform.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Hon. Kofi Asante', 'position_id' => $president->id], [
            'bio' => 'Former parliamentarian and business leader. Known for his innovative approaches to organizational growth and community development.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);

        // Vice President Candidates
        Candidate::updateOrCreate(['name' => 'Mrs. Ama Serwaa', 'position_id' => $vicePresident->id], [
            'bio' => 'Strategic planner with expertise in organizational development. MBA holder with 15 years of executive management experience.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Mr. Yaw Boateng', 'position_id' => $vicePresident->id], [
            'bio' => 'Collaborative leader with strong communication skills. Background in project management and stakeholder engagement.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Dr. Efua Mensah', 'position_id' => $vicePresident->id], [
            'bio' => 'Healthcare administrator and policy analyst. Known for her analytical skills and systematic approach to problem-solving.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);

        // General Secretary Candidates
        Candidate::updateOrCreate(['name' => 'Mr. Francis Adjei', 'position_id' => $generalSecretary->id], [
            'bio' => 'Administrative expert with 20 years of experience in correspondence management and organizational communication.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Ms. Abena Osei', 'position_id' => $generalSecretary->id], [
            'bio' => 'Detail-oriented professional with expertise in record keeping and administrative systems. Strong background in legal documentation.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Mr. Kwaku Darko', 'position_id' => $generalSecretary->id], [
            'bio' => 'Communications specialist with experience in digital documentation and information management systems.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);

        // Treasurer Candidates
        Candidate::updateOrCreate(['name' => 'CPA Rebecca Owusu', 'position_id' => $treasurer->id], [
            'bio' => 'Certified Public Accountant with 18 years of financial management experience. Expert in budgeting, auditing, and financial planning.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Mr. Daniel Appiah', 'position_id' => $treasurer->id], [
            'bio' => 'Banking professional with expertise in financial analysis and investment management. Strong track record in fiscal responsibility.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Mrs. Joyce Amoah', 'position_id' => $treasurer->id], [
            'bio' => 'Financial consultant with experience in non-profit financial management. Known for transparency and accountability in financial stewardship.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);

        // Organizing Secretary Candidates
        Candidate::updateOrCreate(['name' => 'Mr. Isaac Tetteh', 'position_id' => $organizingSecretary->id], [
            'bio' => 'Event management professional with 12 years of experience in coordinating large-scale activities and programs.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Ms. Patience Asiedu', 'position_id' => $organizingSecretary->id], [
            'bio' => 'Program coordinator with expertise in logistics and stakeholder management. Known for attention to detail and successful event execution.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Mr. Godwin Mensah', 'position_id' => $organizingSecretary->id], [
            'bio' => 'Operations manager with strong organizational skills. Experience in coordinating multi-departmental activities and resource allocation.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);

        // Financial Secretary Candidates
        Candidate::updateOrCreate(['name' => 'Mrs. Comfort Asante', 'position_id' => $financialSecretary->id], [
            'bio' => 'Accounting professional with expertise in financial record keeping and transaction management. Committed to accuracy and transparency.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Mr. Stephen Ofosu', 'position_id' => $financialSecretary->id], [
            'bio' => 'Bookkeeping specialist with 15 years of experience in financial documentation and reporting systems.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Ms. Lydia Boakye', 'position_id' => $financialSecretary->id], [
            'bio' => 'Financial analyst with strong analytical skills and experience in budget monitoring and financial compliance.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);

        // Secretary Candidates
        Candidate::updateOrCreate(['name' => 'Ms. Priscilla Nkansah', 'position_id' => $secretary->id], [
            'bio' => 'Administrative professional with excellent organizational and communication skills. Experience in executive support and office management.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Mrs. Vivian Ampong', 'position_id' => $secretary->id], [
            'bio' => 'Secretarial expert with proficiency in modern office technologies and document management systems.',
            'photo_url' => '/images/candidates/woman.png',
            'status' => 'active',
        ]);
        Candidate::updateOrCreate(['name' => 'Mr. Richard Opoku', 'position_id' => $secretary->id], [
            'bio' => 'Administrative coordinator with strong interpersonal skills and experience in meeting coordination and minute taking.',
            'photo_url' => '/images/candidates/man.png',
            'status' => 'active',
        ]);
    }
}
