import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextResponse, NextRequest } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function GET(request: NextRequest) {
    //extract token from token
    const userId = await getDataFromToken(request);

    try {
        const user = await User.findOne({ _id: userId }).select("-password");
        // check if there is no user
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}