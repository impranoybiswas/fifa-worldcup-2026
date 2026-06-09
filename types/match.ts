export interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: {
    name: string;
    crest?: string;
  };
  awayTeam: {
    name: string;
    crest?: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}
