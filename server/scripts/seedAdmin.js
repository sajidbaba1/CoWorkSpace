require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminEmail = 'ss2727303@gmail.com';
        const adminPass = 'Sajidsai1';

        let user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('User already exists, updating role to admin...');
            user.role = 'admin';
            // Update password just in case
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(adminPass, salt);
            await user.save();
            console.log('User role updated to Admin');
        } else {
            console.log('Creating new Admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPass, salt);

            user = new User({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await user.save();
            console.log('Admin User Created Successfully');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
