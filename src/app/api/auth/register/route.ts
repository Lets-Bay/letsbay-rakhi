import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { registerSchema } from '@/lib/validation';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error?.issues[0]?.message },
                { status: 400 }
            );
        }

        const { name, email, password } = parsed.data;

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);
        const user = await User.create({ name, email, passwordHash });

        const token = signToken({ userId: user._id.toString(), email: user.email });

        const response = NextResponse.json(
            { message: 'Account created successfully', user: { id: user._id, name: user.name, email: user.email } },
            { status: 201 }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 });
    }
}
