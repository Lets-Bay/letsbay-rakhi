import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getUserFromRequest, hashPassword, comparePassword } from '@/lib/auth';
import { updateSettingsSchema } from '@/lib/validation';

export async function PATCH(req: NextRequest) {
    try {
        const payload = getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsed = updateSettingsSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        await connectDB();
        const user = await User.findById(payload.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (parsed.data.name) {
            user.name = parsed.data.name;
        }

        if (parsed.data.newPassword && parsed.data.currentPassword) {
            const valid = await comparePassword(parsed.data.currentPassword, user.passwordHash);
            if (!valid) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
            }
            user.passwordHash = await hashPassword(parsed.data.newPassword);
        }

        await user.save();

        return NextResponse.json({
            message: 'Settings updated',
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
