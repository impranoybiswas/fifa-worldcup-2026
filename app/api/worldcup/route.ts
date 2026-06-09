import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
        },
        next: {
          revalidate: 60,
        },
      },
    );

    const data = await response.json();

    return NextResponse.json(data.matches || []);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
