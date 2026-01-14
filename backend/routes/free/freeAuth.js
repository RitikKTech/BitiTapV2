const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const FreeSeller = require('../../models/free/FreeSeller');
require('dotenv').config();

// 1. SIGNUP ROUTE (Email bhejne wala) 📧
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let seller = await FreeSeller.findOne({ email });
        if (seller) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Token aur Link Banao
        const verificationToken = crypto.randomBytes(32).toString('hex');

        seller = new FreeSeller({
            name,
            email,
            password, // Password abhi plain hai, neeche hash hoga
            verificationToken
        });

        // Password Hash Karo
        const salt = await bcrypt.genSalt(10);
        seller.password = await bcrypt.hash(password, salt);

        await seller.save();

        // 📨 PROFESSIONAL EMAIL SENDING LOGIC STARTS HERE
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const verificationUrl = `http://localhost:3000/free/verify/${verificationToken}`;

        // 👇 Ye hai Naya Professional HTML Design
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🚀 Activate Your Bititap Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
                    
                    <div style="background-color: #007bff; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bititap 🚀</h1>
                    </div>

                    <div style="padding: 30px; color: #333333;">
                        <h2 style="margin-top: 0; color: #333333;">Welcome, ${name}!</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                            Thank you for joining Bititap! You are just one step away from selling your digital products to the world.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                            Please click the button below to verify your email address:
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #28a745; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                Verify My Account ✅
                            </a>
                        </div>

                        <p style="font-size: 14px; color: #888888; margin-top: 20px;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
                        </p>
                    </div>

                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #e0e0e0;">
                        &copy; 2026 Bititap Inc. All rights reserved.<br>
                        Prayagraj, India
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        // 📨 EMAIL END

        res.status(200).json({ message: 'Signup successful! Please check your email to verify.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. LOGIN ROUTE (Token dene wala) 🔑
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let seller = await FreeSeller.findOne({ email });
        if (!seller) return res.status(400).json({ message: 'Invalid Credentials' });

        // Check Email Verification
        if (!seller.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first!' });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const payload = { user: { id: seller.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, plan: seller.plan });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 3. VERIFY ROUTE (Link check karne wala) ✅
router.post('/verify', async (req, res) => {
    const { token } = req.body;
    try {
        let seller = await FreeSeller.findOne({ verificationToken: token });

        if (!seller) return res.status(400).json({ message: 'Invalid or Expired Token' });

        seller.isVerified = true;
        seller.verificationToken = undefined; // Token ka kaam khatam
        await seller.save();

        res.json({ message: 'Email Verified Successfully! You can now Login.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;