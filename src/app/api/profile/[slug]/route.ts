import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RakhiProfile } from '@/models/RakhiProfile';
import { Rakhi } from '@/models/Rakhi';
import { RakhiDesign } from '@/models/RakhiDesign';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;
        const normalizedSlug = slug.toLowerCase();

        const profile = await RakhiProfile.findOne({ slug: normalizedSlug });

        if (!profile) {
            return NextResponse.json({ error: 'This Rakhi link doesn\'t exist' }, { status: 404 });
        }

        if (!profile.isActive) {
            return NextResponse.json({ error: 'This Rakhi link is no longer active' }, { status: 410 });
        }

        // Get count of rakhis for this profile
        const rakhiCount = await Rakhi.countDocuments({ rakhiProfileId: profile._id });

        // Get available designs
        const designs = await RakhiDesign.find({ isActive: true })
            .sort({ sortOrder: 1 })
            .select('name imageUrl description');

        return NextResponse.json({
            profile: {
                id: profile._id,
                displayName: profile.displayName,
                slug: profile.slug,
                customMessage: profile.customMessage,
            },
            designs: designs.map((d) => ({
                id: d._id,
                name: d.name,
                imageUrl: d.imageUrl,
                description: d.description,
            })),
            rakhiCount,
        });
    } catch (error) {
        console.error('Get public profile error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
