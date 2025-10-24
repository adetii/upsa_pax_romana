<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e9ecef;
        }
        .otp-code {
            background: #fff;
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #667eea;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔐 Admin Login Verification</h1>
        <p>St. Greg. Voting System</p>
    </div>
    
    <div class="content">
        <h2>Hello {{ $user->name }},</h2>
        
        <p>You have requested to log in to the St. Greg. Voting System admin panel. Please use the following One-Time Password (OTP) to complete your login:</p>
        
        <div class="otp-code">
            {{ $otpCode }}
        </div>
        
        <div class="warning">
            <strong>⚠️ Important Security Information:</strong>
            <ul>
                <li>This OTP is valid for <strong>5 minutes</strong> only</li>
                <li>You have <strong>3 attempts</strong> to enter the correct code</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this login, please ignore this email</li>
                <li>For security reasons, this code can only be used once</li>
            </ul>
        </div>
        
        <p>If you're having trouble logging in or didn't request this OTP, please contact the system administrator immediately.</p>
        
        <p>Best regards,<br>
        <strong>St. Greg. Voting System Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; {{ date('Y') }} St. Greg. Voting System. All rights reserved.</p>
    </div>
</body>
</html>