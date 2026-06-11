import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "matches";

  let endpoint = "https://api.football-data.org/v4/competitions/WC";

  if (type === "matches") {
    endpoint += "/matches";
  } else if (type === "standings") {
    endpoint += "/standings";
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
      },
      next: {
        revalidate: 60,
      },
    });

    const data = await response.json();

    // If matches, we want to return the array directly for compatibility
    if (type === "matches") {
      return NextResponse.json(data.matches || []);
    }

    if (type === "standings") {
      return NextResponse.json(data.standings || []);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`API Error (${type}):`, error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
