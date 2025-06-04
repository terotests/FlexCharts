import type { TimeLineBarData } from "../components/TimeLineChart";

/**
 * Finnish Presidents from 1917 to present day
 * Data includes all presidents and their terms of office
 */
export const finnishPresidents: TimeLineBarData[] = [
  // Government parties during Kallio era
  {
    id: "historic-event",
    start: "1937-03-01",
    end: "1940-12-19",
    label: "Agraariliitto (Agrarian League)",
    backgroundColor: "#CD853F",
    textColor: "white",
    className: "historic-event government-party",
  }, // Risto Ryti

  // Historic Events - Civil War
  {
    id: "stahlberg",
    start: "1919-07-25",
    end: "1925-03-01",
    label: "Kaarlo Juho Ståhlberg",
    backgroundColor: "#0F4A8C",
    textColor: "white",
    className: "first-president",
  },

  // Government parties during Ståhlberg era
  {
    id: "historic-event",
    start: "1919-07-25",
    end: "1925-03-01",
    label: "Edistyspuolue (Progressive Party)",
    backgroundColor: "#4169E1",
    textColor: "white",
    className: "historic-event government-party",
  },
  {
    id: "relander",
    start: "1925-03-01",
    end: "1931-03-01",
    label: "Lauri Kristian Relander",
    backgroundColor: "#E6B800",
    textColor: "black",
    className: "early-republic",
  },

  // Government parties during Relander era
  {
    id: "historic-event",
    start: "1925-03-01",
    end: "1931-03-01",
    label: "Agraariliitto (Agrarian League)",
    backgroundColor: "#32CD32",
    textColor: "white",
    className: "historic-event government-party",
  },
  {
    id: "svinhufvud",
    start: "1931-03-01",
    end: "1937-03-01",
    label: "Pehr Evind Svinhufvud",
    backgroundColor: "#0070C0",
    textColor: "white",
    className: "pre-war",
  },

  // Government parties during Svinhufvud era
  {
    id: "historic-event",
    start: "1931-03-01",
    end: "1937-03-01",
    label: "Kokoomus (National Coalition Party)",
    backgroundColor: "#005580",
    textColor: "white",
    className: "historic-event government-party",
  },
  {
    id: "kallio",
    start: "1937-03-01",
    end: "1940-12-19",
    label: "Kyösti Kallio",
    backgroundColor: "#FF6B35",
    textColor: "white",
    className: "wartime-leader",
  },

  {
    id: "ryti",
    start: "1940-12-19",
    end: "1944-08-01",
    label: "Risto Ryti",
    backgroundColor: "#8B4A8B",
    textColor: "white",
    className: "wartime-leader",
  },

  // Government parties during Ryti era
  {
    id: "historic-event",
    start: "1940-12-19",
    end: "1944-08-01",
    label: "Edistyspuolue (Progressive Party)",
    backgroundColor: "#4169E1",
    textColor: "white",
    className: "historic-event government-party",
  }, // Carl Gustaf Emil Mannerheim
  {
    id: "mannerheim",
    start: "1944-08-04",
    end: "1946-03-11",
    label: "Carl Gustaf Emil Mannerheim",
    backgroundColor: "#B22222",
    textColor: "white",
    className: "wartime-leader military-leader",
  },

  // Government parties during Mannerheim era
  {
    id: "historic-event",
    start: "1944-08-04",
    end: "1946-03-11",
    label: "Itsenäinen (Independent)",
    backgroundColor: "#696969",
    textColor: "white",
    className: "historic-event government-party",
  }, // Juho Kusti Paasikivi
  {
    id: "paasikivi",
    start: "1946-03-11",
    end: "1956-03-01",
    label: "Juho Kusti Paasikivi",
    backgroundColor: "#2E8B57",
    textColor: "white",
    className: "post-war-reconstruction",
  },

  // Government parties during Paasikivi era
  {
    id: "historic-event",
    start: "1946-03-11",
    end: "1956-03-01",
    label: "Kansallinen Kokoomus (National Coalition Party)",
    backgroundColor: "#005580",
    textColor: "white",
    className: "historic-event government-party",
  },

  {
    id: "kekkonen",
    start: "1956-03-01",
    end: "1982-01-27",
    label: "Urho Kaleva Kekkonen",
    backgroundColor: "#4169E1",
    textColor: "white",
  },

  // Government parties during Kekkonen era
  {
    id: "historic-event",
    start: "1956-03-01",
    end: "1982-01-27",
    label: "Keskustapuolue (Centre Party)",
    backgroundColor: "#32CD32",
    textColor: "white",
    className: "historic-event government-party",
  },
  {
    id: "koivisto",
    start: "1982-01-27",
    end: "1994-03-01",
    label: "Mauno Henrik Koivisto",
    backgroundColor: "#DC143C",
    textColor: "white",
  },

  // Government parties during Koivisto era
  {
    id: "historic-event",
    start: "1982-01-27",
    end: "1994-03-01",
    label: "Suomen Sosialidemokraattinen Puolue (SDP)",
    backgroundColor: "#FF1493",
    textColor: "white",
    className: "historic-event government-party",
  },

  {
    id: "ahtisaari",
    start: "1994-03-01",
    end: "2000-03-01",
    label: "Martti Ahtisaari",
    backgroundColor: "#8B0000",
    textColor: "white",
  },

  // Government parties during Ahtisaari era
  {
    id: "historic-event",
    start: "1994-03-01",
    end: "2000-03-01",
    label: "Suomen Sosialidemokraattinen Puolue (SDP)",
    backgroundColor: "#FF1493",
    textColor: "white",
    className: "historic-event government-party",
  }, // Tarja Kaarina Halonen
  {
    id: "halonen",
    start: "2000-03-01",
    end: "2012-03-01",
    label: "Tarja Halonen",
    backgroundColor: "#FF1493",
    textColor: "white",
  },

  // Government parties during Halonen era
  {
    id: "historic-event",
    start: "2000-03-01",
    end: "2012-03-01",
    label: "Suomen Sosialidemokraattinen Puolue (SDP)",
    backgroundColor: "#FF1493",
    textColor: "white",
    className: "historic-event government-party",
  },

  {
    id: "niinisto",
    start: "2012-03-01",
    end: "2024-03-01",
    label: "Sauli Niinistö",
    backgroundColor: "#4682B4",
    textColor: "white",
  },

  // Government parties during Niinistö era
  {
    id: "historic-event",
    start: "2012-03-01",
    end: "2024-03-01",
    label: "Kansallinen Kokoomus (National Coalition Party)",
    backgroundColor: "#005580",
    textColor: "white",
    className: "historic-event government-party",
  }, // Alexander Stubb
  {
    id: "stubb",
    start: "2024-03-01",
    end: "2025-06-01",
    label: "Alexander Stubb",
    backgroundColor: "#228B22",
    textColor: "white",
  },

  // Government parties during Stubb era
  {
    id: "historic-event",
    start: "2024-03-01",
    end: "2025-06-01",
    label: "Kansallinen Kokoomus (National Coalition Party)",
    backgroundColor: "#005580",
    textColor: "white",
    className: "historic-event government-party",
  },
];

/**
 * Metadata about the Finnish Presidents dataset
 */
export const finnishPresidentsMetadata = {
  title: "Suomen Presidentit (1919-2025)",
  description:
    "Suomen tasavallan presidenttien aikajana itsenäisyyden alkuajoista nykypäivään",
  startDate: "1917",
  endDate: "2030",
  interval: "Y" as const,
  colorLegend: {
    "#0F4A8C": "Ståhlberg (1919-1925)",
    "#E6B800": "Relander (1925-1931)",
    "#0070C0": "Svinhufvud (1931-1937)",
    "#FF6B35": "Kallio (1937-1940)",
    "#8B4A8B": "Ryti (1940-1944)",
    "#B22222": "Mannerheim (1944-1946)",
    "#2E8B57": "Paasikivi (1946-1956)",
    "#4169E1": "Kekkonen (1956-1982)",
    "#DC143C": "Koivisto (1982-1994)",
    "#8B0000": "Ahtisaari (1994-2000)",
    "#FF1493": "Halonen (2000-2012)",
    "#4682B4": "Niinistö (2012-2024)",
    "#228B22": "Stubb (2024-)",
  },
};
