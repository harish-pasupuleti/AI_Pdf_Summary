export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        throw new Error(
          "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
        );
      }
      
}

