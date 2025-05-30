import type { TimeLineBarData } from "../components/TimeLineChart";

/**
 * British Monarchs from 1600 to present day
 * Data includes major royal houses and their reigns
 */
export const britishMonarchs: TimeLineBarData[] = [
  // House of Tudor
  {
    id: "elizabeth-i",
    start: "1558",
    end: "1603",
    label: "Elizabeth I",
    backgroundColor: "#DC143C",
    textColor: "white",
  },

  // House of Stuart
  {
    id: "james-i",
    start: "1603",
    end: "1625",
    label: "James I",
    backgroundColor: "#DAA520",
    textColor: "black",
  },
  {
    id: "charles-i",
    start: "1625",
    end: "1649",
    label: "Charles I",
    backgroundColor: "#DAA520",
    textColor: "black",
  },

  // Commonwealth/Interregnum
  {
    id: "commonwealth",
    start: "1649",
    end: "1660",
    label: "Commonwealth",
    backgroundColor: "#2F4F4F",
    textColor: "white",
  },

  // Stuart Restoration
  {
    id: "charles-ii",
    start: "1660",
    end: "1685",
    label: "Charles II",
    backgroundColor: "#DAA520",
    textColor: "black",
  },
  {
    id: "james-ii",
    start: "1685",
    end: "1688",
    label: "James II",
    backgroundColor: "#DAA520",
    textColor: "black",
  },

  // House of Orange-Nassau
  {
    id: "william-mary",
    start: "1689",
    end: "1702",
    label: "William III & Mary II",
    backgroundColor: "#FF8C00",
    textColor: "black",
  },

  // House of Stuart (final)
  {
    id: "anne",
    start: "1702",
    end: "1714",
    label: "Anne",
    backgroundColor: "#DAA520",
    textColor: "black",
  },

  // House of Hanover
  {
    id: "george-i",
    start: "1714",
    end: "1727",
    label: "George I",
    backgroundColor: "#4169E1",
    textColor: "white",
  },
  {
    id: "george-ii",
    start: "1727",
    end: "1760",
    label: "George II",
    backgroundColor: "#4169E1",
    textColor: "white",
  },
  {
    id: "george-iii",
    start: "1760",
    end: "1820",
    label: "George III",
    backgroundColor: "#4169E1",
    textColor: "white",
  },
  {
    id: "george-iv",
    start: "1820",
    end: "1830",
    label: "George IV",
    backgroundColor: "#4169E1",
    textColor: "white",
  },
  {
    id: "william-iv",
    start: "1830",
    end: "1837",
    label: "William IV",
    backgroundColor: "#4169E1",
    textColor: "white",
  },
  {
    id: "victoria",
    start: "1837",
    end: "1901",
    label: "Victoria",
    backgroundColor: "#4169E1",
    textColor: "white",
  },

  // House of Saxe-Coburg and Gotha
  {
    id: "edward-vii",
    start: "1901",
    end: "1910",
    label: "Edward VII",
    backgroundColor: "#8B4A8B",
    textColor: "white",
  },
  {
    id: "george-v",
    start: "1910",
    end: "1917",
    label: "George V (Saxe-Coburg)",
    backgroundColor: "#8B4A8B",
    textColor: "white",
  },

  // House of Windsor (from 1917)
  {
    id: "george-v-windsor",
    start: "1917",
    end: "1936",
    label: "George V (Windsor)",
    backgroundColor: "#8B0000",
    textColor: "white",
  },
  {
    id: "edward-viii",
    start: "1936",
    end: "1936",
    label: "Edward VIII",
    backgroundColor: "#FF6347",
    textColor: "white",
  },
  {
    id: "george-vi",
    start: "1936",
    end: "1952",
    label: "George VI",
    backgroundColor: "#8B0000",
    textColor: "white",
  },
  {
    id: "elizabeth-ii",
    start: "1952",
    end: "2022",
    label: "Elizabeth II",
    backgroundColor: "#8B0000",
    textColor: "white",
  },
  {
    id: "charles-iii",
    start: "2022",
    end: "2025",
    label: "Charles III",
    backgroundColor: "#8B0000",
    textColor: "white",
  },
];

/**
 * Metadata about the British Monarchs dataset
 */
export const britishMonarchsMetadata = {
  title: "British Monarchs (1558-2025)",
  description:
    "Timeline of British monarchs from Elizabeth I to Charles III, organized by royal houses",
  startDate: "1550",
  endDate: "2050",
  interval: "Y" as const,
  colorLegend: {
    "#DC143C": "House of Tudor",
    "#DAA520": "House of Stuart",
    "#2F4F4F": "Commonwealth/Interregnum",
    "#FF8C00": "House of Orange-Nassau",
    "#4169E1": "House of Hanover",
    "#8B4A8B": "House of Saxe-Coburg and Gotha",
    "#8B0000": "House of Windsor",
    "#FF6347": "Abdication Crisis (Edward VIII)",
  },
};
