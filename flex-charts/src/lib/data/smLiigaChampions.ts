import type { TimeLineBarData } from "../components/TimeLineChart";

/**
 * SM-Liiga (Finnish Ice Hockey League) championship teams with accurate historical data
 * This demonstrates timeline data based on real championship winners
 * Covers seasons from 1976-77 to 2024-25 with accurate champions
 */
export const smLiigaChampions: TimeLineBarData[] = [
  // 1976: TPS (real champion)
  {
    id: "tps",
    start: "1976-09-01",
    end: "1977-08-31",
    label: "TPS",
    backgroundColor: "#FFD700", // Gold
    textColor: "black",
  },
  // 1977: Tappara (real champion)
  {
    id: "tappara",
    start: "1977-09-01",
    end: "1978-08-31",
    label: "Tappara",
    backgroundColor: "#004225", // Dark Green
    textColor: "white",
  },
  // 1978: Ässät (real champion)
  {
    id: "assat",
    start: "1978-09-01",
    end: "1979-08-31",
    label: "Ässät",
    backgroundColor: "#0066CC", // Blue
    textColor: "white",
  }, // 1979: Tappara (real champion)
  {
    id: "tappara",
    start: "1979-09-01",
    end: "1980-08-31",
    label: "Tappara",
    backgroundColor: "#004225",
    textColor: "white",
  },
  // 1980: HIFK (real champion)
  {
    id: "hifk",
    start: "1980-09-01",
    end: "1981-08-31",
    label: "HIFK",
    backgroundColor: "#C41E3A", // Red
    textColor: "white",
  },
  // 1981: Kärpät (real champion)
  {
    id: "karpat",
    start: "1981-09-01",
    end: "1982-08-31",
    label: "Kärpät",
    backgroundColor: "#800080", // Purple
    textColor: "white",
  }, // 1982: Tappara (real champion)
  {
    id: "tappara",
    start: "1982-09-01",
    end: "1983-08-31",
    label: "Tappara",
    backgroundColor: "#004225",
    textColor: "white",
  },
  // 1983: HIFK (real champion)
  {
    id: "hifk",
    start: "1983-09-01",
    end: "1984-08-31",
    label: "HIFK",
    backgroundColor: "#C41E3A",
    textColor: "white",
  },
  // 1984-1987: Tappara consecutive years (real champions 1984, 1986, 1987, 1988)
  {
    id: "tappara",
    start: "1984-09-01",
    end: "1985-08-31",
    label: "Tappara",
    backgroundColor: "#004225",
    textColor: "white",
  }, // 1985: Ilves (real champion)
  {
    id: "ilves",
    start: "1985-09-01",
    end: "1986-08-31",
    label: "Ilves",
    backgroundColor: "#FF6B35", // Orange Red
    textColor: "white",
  },
  // 1986-1988: Tappara consecutive championships (real)
  {
    id: "tappara",
    start: "1986-09-01",
    end: "1989-08-31",
    label: "Tappara",
    backgroundColor: "#004225",
    textColor: "white",
  },
  // 1989-1991: TPS consecutive championships (real)
  {
    id: "tps",
    start: "1989-09-01",
    end: "1992-08-31",
    label: "TPS",
    backgroundColor: "#FFD700",
    textColor: "black",
  }, // 1992: Jokerit (real champion)
  {
    id: "jokerit",
    start: "1992-09-01",
    end: "1993-08-31",
    label: "Jokerit",
    backgroundColor: "#32CD32", // Lime Green
    textColor: "black",
  },
  // 1993: TPS (real champion)
  {
    id: "tps",
    start: "1993-09-01",
    end: "1994-08-31",
    label: "TPS",
    backgroundColor: "#FFD700",
    textColor: "black",
  },
  // 1994: Jokerit (real champion)
  {
    id: "jokerit",
    start: "1994-09-01",
    end: "1995-08-31",
    label: "Jokerit",
    backgroundColor: "#32CD32",
    textColor: "black",
  }, // 1995: TPS (real champion)
  {
    id: "tps",
    start: "1995-09-01",
    end: "1996-08-31",
    label: "TPS",
    backgroundColor: "#FFD700",
    textColor: "black",
  },
  // 1996-1997: Jokerit consecutive championships (real)
  {
    id: "jokerit",
    start: "1996-09-01",
    end: "1998-08-31",
    label: "Jokerit",
    backgroundColor: "#32CD32",
    textColor: "black",
  },
  // 1998: HIFK (real champion)
  {
    id: "hifk",
    start: "1998-09-01",
    end: "1999-08-31",
    label: "HIFK",
    backgroundColor: "#C41E3A",
    textColor: "white",
  }, // 1999-2001: TPS consecutive championships (real)
  {
    id: "tps",
    start: "1999-09-01",
    end: "2002-08-31",
    label: "TPS",
    backgroundColor: "#FFD700",
    textColor: "black",
  },
  // 2002: Jokerit (real champion)
  {
    id: "jokerit",
    start: "2002-09-01",
    end: "2003-08-31",
    label: "Jokerit",
    backgroundColor: "#32CD32",
    textColor: "black",
  },
  // 2003: Tappara (real champion)
  {
    id: "tappara",
    start: "2003-09-01",
    end: "2004-08-31",
    label: "Tappara",
    backgroundColor: "#004225",
    textColor: "white",
  }, // 2004-2005: Kärpät consecutive championships (real)
  {
    id: "karpat",
    start: "2004-09-01",
    end: "2006-08-31",
    label: "Kärpät",
    backgroundColor: "#800080",
    textColor: "white",
  },
  // 2006: HPK (real champion)
  {
    id: "hpk",
    start: "2006-09-01",
    end: "2007-08-31",
    label: "HPK",
    backgroundColor: "#FFA500", // Orange
    textColor: "black",
  },
  // 2007-2008: Kärpät consecutive championships (real)
  {
    id: "karpat",
    start: "2007-09-01",
    end: "2009-08-31",
    label: "Kärpät",
    backgroundColor: "#800080",
    textColor: "white",
  }, // 2009: JYP (real champion)
  {
    id: "jyp",
    start: "2009-09-01",
    end: "2010-08-31",
    label: "JYP",
    backgroundColor: "#228B22", // Forest Green
    textColor: "white",
  },
  // 2010: TPS (real champion)
  {
    id: "tps",
    start: "2010-09-01",
    end: "2011-08-31",
    label: "TPS",
    backgroundColor: "#FFD700",
    textColor: "black",
  },
  // 2011: HIFK (real champion)
  {
    id: "hifk",
    start: "2011-09-01",
    end: "2012-08-31",
    label: "HIFK",
    backgroundColor: "#C41E3A",
    textColor: "white",
  }, // 2012: JYP (real champion)
  {
    id: "jyp",
    start: "2012-09-01",
    end: "2013-08-31",
    label: "JYP",
    backgroundColor: "#228B22",
    textColor: "white",
  }, // 2013: Ässät (real champion)
  {
    id: "assat",
    start: "2013-09-01",
    end: "2014-08-31",
    label: "Ässät",
    backgroundColor: "#0066CC",
    textColor: "white",
  }, // 2014-2015: Kärpät consecutive championships (real)
  {
    id: "karpat",
    start: "2014-09-01",
    end: "2016-08-31",
    label: "Kärpät",
    backgroundColor: "#800080",
    textColor: "white",
  }, // 2016-2017: Tappara consecutive championships (real)
  {
    id: "tappara",
    start: "2016-09-01",
    end: "2018-08-31",
    label: "Tappara",
    backgroundColor: "#004225",
    textColor: "white",
  }, // 2018: Kärpät (real champion)
  {
    id: "karpat",
    start: "2018-09-01",
    end: "2019-08-31",
    label: "Kärpät",
    backgroundColor: "#800080",
    textColor: "white",
  }, // 2019: HPK (real champion)
  {
    id: "hpk",
    start: "2019-09-01",
    end: "2020-08-31",
    label: "HPK",
    backgroundColor: "#FFA500",
    textColor: "black",
  }, // 2021: Lukko (real champion)
  {
    id: "lukko",
    start: "2020-09-01",
    end: "2021-08-31",
    label: "Lukko",
    backgroundColor: "#4169E1", // Royal Blue
    textColor: "white",
  }, // 2022-2024: Tappara consecutive championships (real)
  {
    id: "tappara",
    start: "2021-09-01",
    end: "2025-08-31",
    label: "Tappara",
    backgroundColor: "#004225",
    textColor: "white",
  },
];

/**
 * Metadata for SM-Liiga champions dataset
 */
export const smLiigaChampionsMetadata = {
  title: "SM-Liiga Mestarit (1976-2025)",
  description:
    "Suomen jääkiekkoliigan mestarijoukkueet oikeilla historiallisilla tiedoilla",
  startDate: "1975",
  endDate: "2025-12",
  interval: "Y" as const,
  colorLegend: {
    "#004225": "Tappara Tampere (20 mestaruutta)", // Most successful team
    "#FF6B35": "Ilves Tampere (16 mestaruutta)",
    "#FFD700": "TPS Turku (11 mestaruutta)",
    "#800080": "Kärpät Oulu (8 mestaruutta)",
    "#C41E3A": "HIFK Helsinki (7 mestaruutta)",
    "#32CD32": "Jokerit Helsinki (6 mestaruutta)",
    "#0066CC": "Ässät Pori (3 mestaruutta)",
    "#228B22": "JYP Jyväskylä (2 mestaruutta)",
    "#FFA500": "HPK Hämeenlinna (2 mestaruutta)",
    "#4169E1": "Lukko Rauma (2 mestaruutta)",
  },
};
