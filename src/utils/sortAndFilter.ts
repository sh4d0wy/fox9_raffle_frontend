import type { RaffleTypeBackend } from "types/backend/raffleTypes";
import type { GumballBackendDataType } from "types/backend/gumballTypes";

export type SortOption =
  | "Recently Added"
  | "Expiring Soon"
  | "Selling out soon"
  | "Price: Low to High"
  | "Price: High to Low"
  | "TTV/Floor: Low to High"
  | "TTV/Floor: High to Low"
  | "Floor: Low to High"
  | "Floor: High to Low"
  | "Sort";

export interface FilterOptions {
  raffleType: "token" | "nft";
  selectedToken: { id: number; name: string } | null;
  selectedCollection: { id: number; name: string } | null;
  floorMin: string;
  floorMax: string;
  endTimeAfter: { date: string; time: string };
  endTimeBefore: { date: string; time: string };
}

function parseFilterDateTime(date: string, time: string): Date | null {
  if (!date) return null;
  const dateObj = new Date(date);
  if (time) {
    const [hour, minute] = time.split(":");
    const hours = parseInt(hour, 10) || 0;
    const minutes = parseInt(minute, 10) || 0;
    dateObj.setHours(hours, minutes, 0, 0);
  }
  return dateObj;
}

export function sortRaffles(
  raffles: RaffleTypeBackend[],
  sortOption: string
): RaffleTypeBackend[] {
  const sorted = [...raffles];

  switch (sortOption) {
    case "Recently Added":
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

    case "Expiring Soon":
      return sorted.sort((a, b) => {
        const dateA = a.endsAt ? new Date(a.endsAt).getTime() : Infinity;
        const dateB = b.endsAt ? new Date(b.endsAt).getTime() : Infinity;
        return dateA - dateB;
      });

    case "Selling out soon":
      return sorted.sort((a, b) => {
        const remainingA = (a.ticketSupply || 0) - (a.ticketSold || 0);
        const remainingB = (b.ticketSupply || 0) - (b.ticketSold || 0);
        return remainingA - remainingB;
      });

    case "Price: Low to High":
      return sorted.sort((a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0));

    case "Price: High to Low":
      return sorted.sort((a, b) => (b.ticketPrice || 0) - (a.ticketPrice || 0));

    case "TTV/Floor: Low to High":
      return sorted.sort((a, b) => {
        const ratioA = a.floor && a.floor > 0 ? (a.ttv || 0) / a.floor : Infinity;
        const ratioB = b.floor && b.floor > 0 ? (b.ttv || 0) / b.floor : Infinity;
        return ratioA - ratioB;
      });

    case "TTV/Floor: High to Low":
      return sorted.sort((a, b) => {
        const ratioA = a.floor && a.floor > 0 ? (a.ttv || 0) / a.floor : 0;
        const ratioB = b.floor && b.floor > 0 ? (b.ttv || 0) / b.floor : 0;
        return ratioB - ratioA;
      });

    case "Floor: Low to High":
      return sorted.sort((a, b) => (a.floor || 0) - (b.floor || 0));

    case "Floor: High to Low":
      return sorted.sort((a, b) => (b.floor || 0) - (a.floor || 0));

    default:
      return sorted;
  }
}

export function filterRaffles(
  raffles: RaffleTypeBackend[],
  filters: FilterOptions
): RaffleTypeBackend[] {
  return raffles.filter((raffle) => {
    if (filters.raffleType === "nft" && raffle.prizeData?.type !== "NFT") {
      return false;
    }
    if (filters.raffleType === "token" && raffle.prizeData?.type !== "TOKEN") {
      return false;
    }

    if (filters.selectedToken) {
      const tokenName = filters.selectedToken.name.toLowerCase();
      const prizeSymbol = raffle.prizeData?.symbol?.toLowerCase() || "";
      const prizeName = raffle.prizeData?.name?.toLowerCase() || "";
      
      if (prizeSymbol !== tokenName && prizeName !== tokenName && !prizeName.includes(tokenName) && !prizeSymbol.includes(tokenName)) {
        return false;
      }
    }

    if (filters.selectedCollection) {
      const collectionName = filters.selectedCollection.name.toLowerCase();
      const prizeCollection = raffle.prizeData?.collection?.toLowerCase() || "";
      
      if (prizeCollection !== collectionName && !prizeCollection.includes(collectionName)) {
        return false;
      }
    }

    const floor = raffle.floor || 0;
    if (filters.floorMin && floor < parseFloat(filters.floorMin)) {
      return false;
    }
    if (filters.floorMax && floor > parseFloat(filters.floorMax)) {
      return false;
    }

    const endsAt = raffle.endsAt ? new Date(raffle.endsAt) : null;
    if (endsAt) {
      const afterDate = parseFilterDateTime(
        filters.endTimeAfter.date,
        filters.endTimeAfter.time
      );
      const beforeDate = parseFilterDateTime(
        filters.endTimeBefore.date,
        filters.endTimeBefore.time
      );

      if (afterDate && endsAt < afterDate) {
        return false;
      }
      if (beforeDate && endsAt > beforeDate) {
        return false;
      }
    }

    return true;
  });
}

export function sortGumballs(
  gumballs: GumballBackendDataType[],
  sortOption: string
): GumballBackendDataType[] {
  const sorted = [...gumballs];

  switch (sortOption) {
    case "Recently Added":
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

    case "Expiring Soon":
      return sorted.sort((a, b) => {
        const dateA = a.endTime ? new Date(a.endTime).getTime() : Infinity;
        const dateB = b.endTime ? new Date(b.endTime).getTime() : Infinity;
        return dateA - dateB;
      });

    case "Selling out soon":
      return sorted.sort((a, b) => {
        const remainingA = (a.totalTickets || 0) - (a.ticketsSold || 0);
        const remainingB = (b.totalTickets || 0) - (b.ticketsSold || 0);
        return remainingA - remainingB;
      });

    case "Price: Low to High":
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.ticketPrice || "0");
        const priceB = parseFloat(b.ticketPrice || "0");
        return priceA - priceB;
      });

    case "Price: High to Low":
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.ticketPrice || "0");
        const priceB = parseFloat(b.ticketPrice || "0");
        return priceB - priceA;
      });

    case "TTV/Floor: Low to High":
      return sorted.sort((a, b) => {
        const ttvA = parseFloat(a.totalPrizeValue || "0");
        const ttvB = parseFloat(b.totalPrizeValue || "0");
        // Since gumballs don't have a direct floor, use maxRoi as proxy
        return (a.maxRoi || 0) - (b.maxRoi || 0);
      });

    case "TTV/Floor: High to Low":
      return sorted.sort((a, b) => {
        return (b.maxRoi || 0) - (a.maxRoi || 0);
      });

    case "Floor: Low to High":
      return sorted.sort((a, b) => {
        const ttvA = parseFloat(a.totalPrizeValue || "0");
        const ttvB = parseFloat(b.totalPrizeValue || "0");
        return ttvA - ttvB;
      });

    case "Floor: High to Low":
      return sorted.sort((a, b) => {
        const ttvA = parseFloat(a.totalPrizeValue || "0");
        const ttvB = parseFloat(b.totalPrizeValue || "0");
        return ttvB - ttvA;
      });

    default:
      return sorted;
  }
}

export function filterGumballs(
  gumballs: GumballBackendDataType[],
  filters: FilterOptions
): GumballBackendDataType[] {
  return gumballs.filter((gumball) => {
    if (filters.selectedToken) {
      const tokenName = filters.selectedToken.name.toLowerCase();
      const hasPrizeWithToken = gumball.prizes?.some((prize) => {
        const prizeSymbol = prize.symbol?.toLowerCase() || "";
        const prizeName = prize.name?.toLowerCase() || "";
        return prizeSymbol === tokenName || prizeName === tokenName || prizeSymbol.includes(tokenName) || prizeName.includes(tokenName);
      });
      
      if (!hasPrizeWithToken) {
        return false;
      }
    }

    const prizeValue = parseFloat(gumball.totalPrizeValue || "0");
    if (filters.floorMin && prizeValue < parseFloat(filters.floorMin)) {
      return false;
    }
    if (filters.floorMax && prizeValue > parseFloat(filters.floorMax)) {
      return false;
    }

    const endTime = gumball.endTime ? new Date(gumball.endTime) : null;
    if (endTime) {
      const afterDate = parseFilterDateTime(
        filters.endTimeAfter.date,
        filters.endTimeAfter.time
      );
      const beforeDate = parseFilterDateTime(
        filters.endTimeBefore.date,
        filters.endTimeBefore.time
      );

      if (afterDate && endTime < afterDate) {
        return false;
      }
      if (beforeDate && endTime > beforeDate) {
        return false;
      }
    }

    return true;
  });
}

export interface AuctionItem {
  id?: number;
  heading?: string;
  userName?: string;
  val?: number;
  val2?: string;
  createdAt?: string | Date;
  endsAt?: string | Date;
  AuctionTime?: string;
  floor?: number;
  [key: string]: unknown;
}

export function sortAuctions(
  auctions: AuctionItem[],
  sortOption: string
): AuctionItem[] {
  const sorted = [...auctions];

  switch (sortOption) {
    case "Recently Added":
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
        return dateB - dateA;
      });

    case "Expiring Soon":
      return sorted.sort((a, b) => {
        const dateA = a.endsAt ? new Date(a.endsAt as string).getTime() : Infinity;
        const dateB = b.endsAt ? new Date(b.endsAt as string).getTime() : Infinity;
        return dateA - dateB;
      });

    case "Price: Low to High":
      return sorted.sort((a, b) => (a.val || 0) - (b.val || 0));

    case "Price: High to Low":
      return sorted.sort((a, b) => (b.val || 0) - (a.val || 0));

    case "Floor: Low to High":
      return sorted.sort((a, b) => (a.floor || a.val || 0) - (b.floor || b.val || 0));

    case "Floor: High to Low":
      return sorted.sort((a, b) => (b.floor || b.val || 0) - (a.floor || a.val || 0));

    default:
      return sorted;
  }
}

export function filterAuctions(
  auctions: AuctionItem[],
  filters: FilterOptions
): AuctionItem[] {
  return auctions.filter((auction) => {
    if (filters.selectedToken) {
      const tokenName = filters.selectedToken.name.toLowerCase();
      const heading = auction.heading?.toLowerCase() || "";
      
      if (!heading.includes(tokenName)) {
        return false;
      }
    }

    if (filters.selectedCollection) {
      const collectionName = filters.selectedCollection.name.toLowerCase();
      const heading = auction.heading?.toLowerCase() || "";
      const userName = auction.userName?.toLowerCase() || "";
      
      if (!heading.includes(collectionName) && !userName.includes(collectionName)) {
        return false;
      }
    }

    const floor = auction.floor || auction.val || 0;
    if (filters.floorMin && floor < parseFloat(filters.floorMin)) {
      return false;
    }
    if (filters.floorMax && floor > parseFloat(filters.floorMax)) {
      return false;
    }

    const endsAt = auction.endsAt ? new Date(auction.endsAt as string) : null;
    if (endsAt) {
      const afterDate = parseFilterDateTime(
        filters.endTimeAfter.date,
        filters.endTimeAfter.time
      );
      const beforeDate = parseFilterDateTime(
        filters.endTimeBefore.date,
        filters.endTimeBefore.time
      );

      if (afterDate && endsAt < afterDate) {
        return false;
      }
      if (beforeDate && endsAt > beforeDate) {
        return false;
      }
    }

    return true;
  });
}

export type PageType = "raffles" | "gumballs" | "auctions";

export function hasActiveFilters(filters: FilterOptions, pageType: PageType = "raffles"): boolean {
  const hasCommonFilters = !!(
    filters.selectedToken ||
    filters.selectedCollection ||
    filters.floorMin ||
    filters.floorMax
  );

  const hasEndTimeFilter = !!(filters.endTimeAfter.date || filters.endTimeBefore.date);

  return hasCommonFilters || hasEndTimeFilter;
}

export function getActiveFiltersList(filters: FilterOptions, pageType: PageType = "raffles"): { id: string; label: string }[] {
  const activeFilters: { id: string; label: string }[] = [];

  if (pageType === "raffles") {
    if (filters.raffleType === "nft") {
      activeFilters.push({ id: "raffleType", label: "NFT Raffles" });
    } else if (filters.raffleType === "token") {
      activeFilters.push({ id: "raffleType", label: "Token Raffles" });
    }
  }

  if (filters.selectedToken) {
    activeFilters.push({ id: "token", label: `Token: ${filters.selectedToken.name}` });
  }

  if (filters.selectedCollection) {
    activeFilters.push({ id: "collection", label: `Collection: ${filters.selectedCollection.name}` });
  }

  if (filters.floorMin || filters.floorMax) {
    const min = filters.floorMin || "0";
    const max = filters.floorMax || "∞";
    activeFilters.push({ id: "floor", label: `Floor: ${min} - ${max}` });
  }

  if (filters.endTimeAfter.date) {
    activeFilters.push({ id: "endTimeAfter", label: `Ends after: ${new Date(filters.endTimeAfter.date).toLocaleDateString()}` });
  }

  if (filters.endTimeBefore.date) {
    activeFilters.push({ id: "endTimeBefore", label: `Ends before: ${new Date(filters.endTimeBefore.date).toLocaleDateString()}` });
  }

  return activeFilters;
}

