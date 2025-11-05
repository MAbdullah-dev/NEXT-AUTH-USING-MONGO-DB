import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/UserModel';
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

connect();

// ✅ Validation schema using Zod
const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        // ✅ Validate input using Zod
        const validatedData = userSchema.parse(reqBody);
        const { username, email, password } = validatedData;

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();

        console.log(savedUser);

        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id,
        })
        return NextResponse.json(
            {
                message: "User created successfully",
                success: true,
                user: {
                    username: newUser.username,
                    email: newUser.email,
                    _id: newUser._id,
                },
            },
            { status: 201 }
        );


    } catch (error: any) {
        // ✅ Handle Zod validation errors separately
        if (error.errors) {
            return NextResponse.json(
                { errors: error.errors.map((e: any) => e.message) },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
