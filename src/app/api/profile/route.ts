import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RakhiProfile } from '@/models/RakhiProfile';
import { getUserFromRequest } from '@/lib/auth';
import { createProfileSchema, generateSlug } from '@/lib/validation';

export async function POST(req: NextRequest) {
    try {
        const payload = getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Check if user already has a profile
        const existingProfile = await RakhiProfile.findOne({ userId: payload.userId });
        if (existingProfile) {
            return NextResponse.json(
                { error: 'You already have a Rakhi profile', profile: { slug: existingProfile.slug } },
                { status: 409 }
            );
        }

        const body = await req.json();
        const parsed = createProfileSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        let slug = parsed.data.slug || generateSlug(parsed.data.displayName);

        // Ensure slug uniqueness
        let attempts = 0;
        while (attempts < 5) {
            const exists = await RakhiProfile.findOne({ slug });
            if (!exists) break;
            slug = generateSlug(parsed.data.displayName) + '-' + Math.random().toString(36).substring(2, 5);
            attempts++;
        }

        if (attempts >= 5) {
            return NextResponse.json({ error: 'Could not generate a unique link. Please try a different name.' }, { status: 500 });
        }

        const profile = await RakhiProfile.create({
            userId: payload.userId,
            slug,
            displayName: parsed.data.displayName,
            customMessage: parsed.data.customMessage || null,
        });

        return NextResponse.json(
            { message: 'Profile created', profile: { id: profile._id, slug: profile.slug, displayName: profile.displayName } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create profile error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const payload = getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const profile = await RakhiProfile.findOne({ userId: payload.userId });

        if (!profile) {
            return NextResponse.json({ profile: null }, { status: 200 });
        }

        return NextResponse.json({
            profile: {
                id: profile._id,
                slug: profile.slug,
                displayName: profile.displayName,
                customMessage: profile.customMessage,
                isActive: profile.isActive,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
