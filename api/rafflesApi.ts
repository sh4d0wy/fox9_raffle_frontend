import { RafflesData } from "../data/raffles-data";

interface RafflesPage {
  items: typeof RafflesData[number][];
  nextPage: number | null;
}

export const fetchRaffles = async ({
  pageParam = 1,
  filter = "All Raffles",
}: {
  pageParam?: number;
  filter?: string;
}): Promise<RafflesPage> => {
  const pageSize = 8;
  const normalizedFilter = filter.trim().toLowerCase();

  let filteredData = RafflesData;

  switch (normalizedFilter) {
    case "my raffles":
      filteredData = RafflesData.filter((r) => r.isSelected);
      break;

    case "past raffles":
      filteredData = RafflesData.filter(
        (r) => r.totalTickets - r.soldTickets < 1
      );
      break;

    default:
      filteredData = RafflesData;
  }

  const pageItems = filteredData.slice(
    (pageParam - 1) * pageSize,
    pageParam * pageSize
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: pageItems,
        nextPage: pageItems.length < pageSize ? null : pageParam + 1,
      });
    }, 500);
  });
};

