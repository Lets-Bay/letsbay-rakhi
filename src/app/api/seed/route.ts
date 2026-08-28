import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RakhiDesign } from '@/models/RakhiDesign';

const SEED_DESIGNS = [
    {
        name: 'Traditional Red & Gold',
        imageUrl: '/rakhis/traditional-red-gold.svg',
        description: 'Classic red and gold Rakhi with traditional motifs',
        sortOrder: 1,
    },
    {
        name: 'Elegant Gold',
        imageUrl: '/rakhis/elegant-gold.svg',
        description: 'Sophisticated gold Rakhi with delicate patterns',
        sortOrder: 2,
    },
    {
        name: 'Minimal Modern',
        imageUrl: '/rakhis/minimal-modern.svg',
        description: 'Clean, contemporary design for the modern sibling',
        sortOrder: 3,
    },
    {
        name: 'Blue & Silver',
        imageUrl: '/rakhis/blue-silver.svg',
        description: 'Cool-toned Rakhi with silver accents',
        sortOrder: 4,
    },
    {
        name: 'Floral Garden',
        imageUrl: '/rakhis/floral-garden.svg',
        description: 'Beautiful floral patterns inspired by Indian gardens',
        sortOrder: 5,
    },
    {
        name: 'Royal Purple',
        imageUrl: '/rakhis/royal-purple.svg',
        description: 'Regal purple and gold Rakhi fit for royalty',
        sortOrder: 6,
    },
    {
        name: 'Colorful Rainbow',
        imageUrl: '/rakhis/colorful-rainbow.svg',
        description: 'Vibrant, multicolored Rakhi full of joy',
        sortOrder: 7,
    },
    {
        name: 'Cute & Fun',
        imageUrl: '/rakhis/cute-fun.svg',
        description: 'Playful and adorable design with cute charms',
        sortOrder: 8,
    },
    {
        name: 'Premium Diamond',
        imageUrl: '/rakhis/premium-diamond.svg',
        description: 'Luxurious diamond-studded Rakhi design',
        sortOrder: 9,
    },
    {
        name: 'Simple Thread',
        imageUrl: '/rakhis/simple-thread.svg',
        description: 'The beauty of simplicity — a sacred thread',
        sortOrder: 10,
    },
];

export async function POST(req: NextRequest) {
    try {
        // Simple protection - only allow in development
        if (process.env.NODE_ENV === 'production') {
            const authHeader = req.headers.get('authorization');
            if (authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        await connectDB();

        // Check if designs already exist
        const count = await RakhiDesign.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: `Designs already seeded (${count} designs exist)` });
        }

        await RakhiDesign.insertMany(SEED_DESIGNS);

        return NextResponse.json({ message: `Seeded ${SEED_DESIGNS.length} Rakhi designs` });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Failed to seed designs' }, { status: 500 });
    }
}
