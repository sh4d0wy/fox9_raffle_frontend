import { RafflesData } from "../data/raffles-data";
import { getRaffleById, getRaffles } from "./routes/raffleRoutes";
import { useWallet } from "@solana/wallet-adapter-react";
interface RafflesPage {
  items: typeof RafflesData[number][];
  nextPage: number | null;
}

export const fetchRaffles = async ({
  pageParam = 1,
  filter = "All Raffles",
  currentWallet = "",
}: {
  pageParam?: number;
  filter?: string;
  currentWallet?: string;
}): Promise<RafflesPage> => {
  const pageSize = 8;
  console.log("currentFilter",filter);
  let filteredData = await getRaffles(pageParam, pageSize);
  filteredData = filteredData.raffles;
  console.log("filteredData",filteredData);
  console.log("check",filter==="All Raffles");
  if (filter === "My Raffles") filteredData = filteredData.filter((r: any) => r.createdBy === currentWallet);
  if (filter === "All Raffles") filteredData = filteredData.filter((r:any) => r.state.toLowerCase() === "active");
  if (filter === "Past Raffles") filteredData = filteredData.filter((r: any) => r.state.toLowerCase() === "failedended" || r.state.toLowerCase()   === "successended");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: filteredData,
        nextPage: filteredData.length < pageSize ? null : pageParam + 1,
      });
    }, 500); 
  });
};


export const fetchRaffleById = async(raffleId:string)=>{
  const response = await getRaffleById(raffleId);
  console.log("response",response.raffle);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response.raffle);
    }, 500);
  });
}