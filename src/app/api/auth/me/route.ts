import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const payload = getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        await connectDB();
        const user = await User.findById(payload.userId).select('-passwordHash');
        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch {
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
