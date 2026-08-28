import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RakhiProfile } from '@/models/RakhiProfile';
import { Rakhi } from '@/models/Rakhi';
import { RakhiDesign } from '@/models/RakhiDesign';
import { submitRakhiSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
    try {
        // Rate limit by IP
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const { allowed } = rateLimit(ip, 10, 60 * 60 * 1000);
        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many submissions. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await req.json();
        const parsed = submitRakhiSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { slug } = body;
        if (!slug) {
            return NextResponse.json({ error: 'Missing profile slug' }, { status: 400 });
        }

        await connectDB();

        const profile = await RakhiProfile.findOne({ slug: slug.toLowerCase() });
        if (!profile) {
            return NextResponse.json({ error: 'This Rakhi link doesn\'t exist' }, { status: 404 });
        }
        if (!profile.isActive) {
            return NextResponse.json({ error: 'This Rakhi link is no longer active' }, { status: 410 });
        }

        // Verify design exists
        const design = await RakhiDesign.findById(parsed.data.designId);
        if (!design || !design.isActive) {
            return NextResponse.json({ error: 'Invalid Rakhi design' }, { status: 400 });
        }

        // Sanitize text
        const senderName = parsed.data.senderName.replace(/<[^>]*>/g, '').trim();
        const message = parsed.data.message.replace(/<[^>]*>/g, '').trim();

        const rakhi = await Rakhi.create({
            rakhiProfileId: profile._id,
            designId: design._id,
            senderName,
            message,
        });

        return NextResponse.json(
            {
                message: 'Rakhi tied successfully!',
                rakhi: {
                    id: rakhi._id,
                    senderName: rakhi.senderName,
                    message: rakhi.message,
                    designName: design.name,
                    designImage: design.imageUrl,
                    createdAt: rakhi.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Submit rakhi error:', error);
        return NextResponse.json({ error: 'Something went wrong while tying your Rakhi. Please try again.' }, { status: 500 });
    }
}
