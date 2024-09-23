import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const image = formData.get('image_file');

        const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.REMOVE_BG_API_KEY,
            },
            body: formData,
        });

        if (!removeBgResponse.ok) {
            return NextResponse.json({ error: 'Failed to remove background' }, { status: 500 });
        }

        const blob = await removeBgResponse.blob();
        return new Response(blob, {
            headers: {
                'Content-Type': 'image/png',
            },
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
