import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    // Ideally you should verify the signature of the webhook here
    // using @sanity/webhook, but for a simple portfolio we can just accept POSTs
    // or use a simple secret token in the URL like ?secret=YOUR_SECRET
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Make sure to set NEXT_PUBLIC_SANITY_WEBHOOK_SECRET in your Vercel env variables
    // and add ?secret=YOUR_SECRET to your Sanity Webhook URL.
    if (secret !== process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate the generic tag used in all fetch queries
    revalidateTag('sanity');
    
    // Also revalidate the home path just to be sure
    revalidatePath('/');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: err }, { status: 500 });
  }
}
