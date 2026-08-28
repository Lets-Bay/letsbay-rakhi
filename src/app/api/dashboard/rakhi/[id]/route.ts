import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RakhiProfile } from '@/models/RakhiProfile';
import { Rakhi } from '@/models/Rakhi';
import { RakhiDesign } from '@/models/RakhiDesign';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const profile = await RakhiProfile.findOne({ userId: payload.userId });
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const rakhi = await Rakhi.findOne({ _id: id, rakhiProfileId: profile._id });
        if (!rakhi) {
            return NextResponse.json({ error: 'Rakhi not found' }, { status: 404 });
        }

        const design = await RakhiDesign.findById(rakhi.designId);

        return NextResponse.json({
            rakhi: {
                id: rakhi._id,
                senderName: rakhi.senderName,
                message: rakhi.message,
                createdAt: rakhi.createdAt,
                design: design
                    ? { name: design.name, imageUrl: design.imageUrl, description: design.description }
                    : { name: 'Rakhi', imageUrl: '/rakhis/default.svg', description: null },
            },
        });
    } catch (error) {
        console.error('Rakhi detail error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
