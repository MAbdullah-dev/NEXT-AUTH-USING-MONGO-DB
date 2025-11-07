import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email , password } = reqBody;

        console.log(reqBody);
        
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "check your credentials" }, { status: 400 });
        }
        const takenData = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET!, {
            expiresIn: "1d",
        });
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user: takenData,
        });
        response.cookies.set("token", token, {
            httpOnly: true,
        });
        return response;
       
         

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}