import { useQuery } from "@tanstack/react-query";
import { RafflesData } from "../data/raffles-data"; 
import { RafflersPurchasedData } from "../data/Rafflers-Purchased-data"; 
import { GumballsData } from "../data/gumballs-data"; 
import { AucationsData } from "../data/aucations-data"; 

export type CreatorCategory = "rafflers" | "gumballs" | "auctions";
export type RafflerFilter = "created" | "purchased" | "favourite" | "followed";

interface CreatorProfileFilters {
  mainFilter: CreatorCategory | "All";
  rafflerFilter: RafflerFilter | null;
  pageParam?: number;
  pageSize?: number;
}

const getFilteredData = ({
  mainFilter,
  rafflerFilter,
}: {
  mainFilter: CreatorCategory | "All";
  rafflerFilter: RafflerFilter | null;
}) => {
  let created: any[] = [];
  let purchased: any[] = [];

  const appendData = (data: any[]) => {
    created.push(...data.filter(item => item.rafflesType === "created"));
    purchased.push(...data.filter(item => item.rafflesType === "purchased" || item.rafflesType === "favourite"));
  };

  if (mainFilter === "rafflers" || mainFilter === "All") appendData(RafflesData);
  if (mainFilter === "gumballs" || mainFilter === "All") appendData(GumballsData);
  if (mainFilter === "auctions" || mainFilter === "All") appendData(AucationsData);

  if (rafflerFilter) {
    switch (rafflerFilter) {
      case "created":
        purchased = [];
        break;
      case "purchased":
        created = [];
        purchased = [...RafflersPurchasedData];
        break;
      case "favourite":
        created = created.filter(item => item.isFavorite);
        purchased = purchased.filter(item => item.isFavorite);
        break;
      case "followed":
        created = created.filter(item => item.isFollowed);
        purchased = purchased.filter(item => item.isFollowed);
        break;
    }
  }

  return { created, purchased };
};

export const fetchCreatorProfileData = async ({
  mainFilter,
  rafflerFilter,
  pageParam = 1,
  pageSize = 8,
}: CreatorProfileFilters) => {
  const { created, purchased } = getFilteredData({ mainFilter, rafflerFilter });

  const start = (pageParam - 1) * pageSize;
  const end = pageParam * pageSize;

  return new Promise<{ created: typeof created; purchased: typeof purchased }>(resolve => {
    setTimeout(() => {
      resolve({
        created: created.slice(start, end),
        purchased: purchased.slice(start, end),
      });
    }, 500);
  });
};

export const useCreatorProfileData = (
  mainFilter: CreatorCategory | "All",
  rafflerFilter: RafflerFilter | null,
  pageParam: number = 1,
  pageSize: number = 8
) => {
  return useQuery({
    queryKey: ["creator-profile", mainFilter, rafflerFilter, pageParam],
    queryFn: () => fetchCreatorProfileData({ mainFilter, rafflerFilter, pageParam, pageSize }),
    staleTime: 1000 * 60 * 5,
  });
};
