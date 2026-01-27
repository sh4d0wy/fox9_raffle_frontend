import { AucationsData } from "../data/aucations-data";

interface AucationsPage {
  items: typeof AucationsData[number][];
  nextPage: number | null;
}

export const fetchAucations = async ({
  pageParam = 1,
  filter = "Featured",
}: {
  pageParam?: number;
  filter?: string;
}): Promise<AucationsPage> => {
  const pageSize = 8;
  let filteredData = AucationsData;

  if (filter === "All Aucations") filteredData = AucationsData;
  if (filter === "Past Aucations")
    filteredData = AucationsData.filter((r) => r.AuctionTime.includes("Ended"));

  const pageItems = filteredData.slice((pageParam - 1) * pageSize, pageParam * pageSize);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: pageItems,
        nextPage: pageItems.length < pageSize ? null : pageParam + 1,
      });
    }, 500);
  });
};
