export interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  stage?: string;
  group?: string;
  lastUpdated?: string;
  homeTeam: {
    id?: number;
    name: string;
    shortName?: string;
    tla?: string;
    crest?: string;
  };
  awayTeam: {
    id?: number;
    name: string;
    shortName?: string;
    tla?: string;
    crest?: string;
  };
  score: {
    winner?: string | null;
    duration?: string;
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime?: {
      home: number | null;
      away: number | null;
    };
  };
  referees?: {
    name: string;
    nationality: string;
    role: string;
  }[];
}
