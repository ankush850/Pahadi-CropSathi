import { NextResponse, NextRequest } from 'next/server';
import { requireAuth } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  
  if (user) {
    return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 200 });
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
