<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verification Code</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #121b2e; font-size: 24px; margin: 0; }
        .content { color: #4a5568; font-size: 16px; line-height: 1.5; }
        .code-container { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0; }
        .code { font-size: 32px; font-weight: bold; color: #121b2e; letter-spacing: 4px; }
        .footer { margin-top: 40px; font-size: 14px; color: #718096; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Meridian Weather</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering with Meridian Weather. Please use the following 6-digit verification code to complete your registration process.</p>
            
            <div class="code-container">
                <div class="code"><?php echo e($code); ?></div>
            </div>
            
            <p><strong>Note:</strong> This code will expire in 10 minutes.</p>
            <p>If you did not request this code, please ignore this email. <strong>Do not share this code with anyone.</strong></p>
        </div>
        <div class="footer">
            &copy; <?php echo e(date('Y')); ?> Meridian Weather. All rights reserved.
        </div>
    </div>
</body>
</html>
<?php /**PATH D:\meridian-weather\backend\resources\views/emails/verification.blade.php ENDPATH**/ ?>