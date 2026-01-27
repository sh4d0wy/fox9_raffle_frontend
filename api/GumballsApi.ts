import { GumballsData } from "../data/gumballs-data";

interface GumballsPage {
  items: typeof GumballsData[number][];
  nextPage: number | null;
}

export const fetchGumballs = async ({
  pageParam = 1,
 filter = "Featured",
}: {
  pageParam?: number;
  filter?: string;
}): Promise<GumballsPage> => {
  const pageSize = 8;
  let filteredData = GumballsData;

  if (filter === "Featured") filteredData = GumballsData.filter((r) => r.isFavorite);
  if (filter === "All Gumballs") filteredData = GumballsData;
  if (filter === "Past Gumballs") filteredData = GumballsData.filter((r) => r.val < 1);

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
