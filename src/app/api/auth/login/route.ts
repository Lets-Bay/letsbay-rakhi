import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { loginSchema } from '@/lib/validation';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const valid = await comparePassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = signToken({ userId: user._id.toString(), email: user.email });

        const response = NextResponse.json(
            { message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } },
            { status: 200 }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
