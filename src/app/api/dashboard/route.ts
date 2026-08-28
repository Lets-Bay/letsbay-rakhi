import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RakhiProfile } from '@/models/RakhiProfile';
import { Rakhi } from '@/models/Rakhi';
import { RakhiDesign } from '@/models/RakhiDesign';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const payload = getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const profile = await RakhiProfile.findOne({ userId: payload.userId });
        if (!profile) {
            return NextResponse.json({ profile: null, rakhis: [] }, { status: 200 });
        }

        const rakhis = await Rakhi.find({ rakhiProfileId: profile._id })
            .sort({ createdAt: -1 })
            .lean();

        // Get all design IDs from rakhis
        const designIds = [...new Set(rakhis.map((r) => r.designId.toString()))];
        const designs = await RakhiDesign.find({ _id: { $in: designIds } }).lean();
        const designMap = new Map(designs.map((d) => [d._id.toString(), d]));

        const rakhisWithDesigns = rakhis.map((r) => {
            const design = designMap.get(r.designId.toString());
            return {
                id: r._id,
                senderName: r.senderName,
                message: r.message,
                createdAt: r.createdAt,
                design: design
                    ? { name: design.name, imageUrl: design.imageUrl }
                    : { name: 'Rakhi', imageUrl: '/rakhis/default.svg' },
            };
        });

        return NextResponse.json({
            profile: {
                id: profile._id,
                slug: profile.slug,
                displayName: profile.displayName,
            },
            rakhis: rakhisWithDesigns,
            count: rakhis.length,
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
