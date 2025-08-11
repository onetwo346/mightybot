const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('.'));
app.use(express.json());

// Email configuration (using Gmail as example)
const emailTransporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Set via environment variable
        pass: process.env.EMAIL_PASS || 'your-app-password'      // Set via environment variable
    }
});

// Email templates
const generateWelcomeEmail = (userName, userEmail) => {
    return {
        from: '"Mighty AI Team" <noreply@mightyai.com>',
        to: userEmail,
        subject: '🚀 Welcome to Mighty AI - Your Ultimate AI Experience Awaits!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #ffffff; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 15px; margin-bottom: 30px; }
                    .logo { font-size: 36px; font-weight: 900; margin-bottom: 10px; }
                    .subtitle { font-size: 16px; opacity: 0.9; }
                    .content { background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.2); }
                    .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
                    .feature { background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; text-align: center; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; opacity: 0.7; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">🤖 MIGHTY AI</div>
                        <div class="subtitle">Ultimate AI Experience</div>
                    </div>
                    
                    <div class="content">
                        <h2>🎉 Welcome ${userName}!</h2>
                        <p>Thank you for joining Mighty AI! You've just unlocked access to the most advanced AI chatbot experience available.</p>
                        
                        <div class="features">
                            <div class="feature">
                                <h3>💻 Smart AI</h3>
                                <p>Advanced reasoning & problem solving</p>
                            </div>
                            <div class="feature">
                                <h3>⚡ Lightning Fast</h3>
                                <p>Instant responses to all your questions</p>
                            </div>
                            <div class="feature">
                                <h3>🔒 Secure</h3>
                                <p>Your conversations are private & protected</p>
                            </div>
                            <div class="feature">
                                <h3>🎯 Organized</h3>
                                <p>Smart chat categorization & history</p>
                            </div>
                        </div>
                        
                        <h3>🚀 What's Next?</h3>
                        <ul>
                            <li><strong>Start Chatting:</strong> Ask me anything - coding, business, health, travel, and more!</li>
                            <li><strong>Explore Features:</strong> Try the smart chat categorization and settings</li>
                            <li><strong>Save Everything:</strong> Your conversations are automatically organized by topic</li>
                            <li><strong>Stay Productive:</strong> Use me for work, learning, creativity, and daily tasks</li>
                        </ul>
                        
                        <p style="text-align: center;">
                            <a href="http://localhost:3000" class="cta-button">🚀 Start Chatting Now</a>
                        </p>
                        
                        <p><strong>Your Account Details:</strong></p>
                        <ul>
                            <li>Email: ${userEmail}</li>
                            <li>Account Created: ${new Date().toLocaleDateString()}</li>
                            <li>Status: Active & Ready!</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p>🌟 Welcome to the future of AI conversation!</p>
                        <p>Need help? Just start a chat and ask me anything.</p>
                        <p>© 2024 Mighty AI - Ultimate AI Experience</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
};

// Send welcome email function
const sendWelcomeEmail = async (userName, userEmail) => {
    try {
        const emailOptions = generateWelcomeEmail(userName, userEmail);
        await emailTransporter.sendMail(emailOptions);
        console.log(`✅ Welcome email sent to ${userEmail}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Failed to send email to ${userEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

// API endpoint for user signup (to trigger email)
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }
        
        // Send welcome email
        const emailResult = await sendWelcomeEmail(name, email);
        
        if (emailResult.success) {
            res.json({ 
                success: true, 
                message: 'Welcome email sent successfully!',
                email: email 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Account created but email failed to send',
                error: emailResult.error 
            });
        }
    } catch (error) {
        console.error('Signup API error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
    try {
        const testResult = await sendWelcomeEmail('Test User', 'test@example.com');
        res.json(testResult);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Mighty AI is running!`);
    console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
    console.log(`💬 Start chatting with your AI companion!`);
    console.log(`📧 Email notifications enabled!`);
});