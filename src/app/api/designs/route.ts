import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RakhiDesign } from '@/models/RakhiDesign';

export async function GET() {
    try {
        await connectDB();
        const designs = await RakhiDesign.find({ isActive: true })
            .sort({ sortOrder: 1 })
            .select('name imageUrl description');

        return NextResponse.json({
            designs: designs.map((d) => ({
                id: d._id,
                name: d.name,
                imageUrl: d.imageUrl,
                description: d.description,
            })),
        });
    } catch (error) {
        console.error('Get designs error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
