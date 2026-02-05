import { api } from "..";

export const getRafflerLeaderboard = async({timeframe, sortFilter}:{timeframe:string, sortFilter:string})=>{
    try {
        const response = await api.get(`/stats/leaderboard/rafflers?timeFilter=${timeframe}&sortBy=${sortFilter}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getRaffleBuyerLeaderboard = async({timeframe, sortFilter}:{timeframe:string, sortFilter:string})=>{
    try {
        const response = await api.get(`/stats/leaderboard/buyers?timeFilter=${timeframe}&sortBy=${sortFilter}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getBoughtPnl = async({timeframe, month=new Date().getMonth()+1, year=new Date().getFullYear()}:{timeframe:string, month:number, year:number})=>{
    console.log("month", month);
    console.log("year", year);
    try {
        const response = await api.get(`/stats/pnl/bought?timeframe=${timeframe}&month=${month}&year=${year}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getSoldPnl = async({timeframe, month=new Date().getMonth()+1, year=new Date().getFullYear()}:{timeframe:string, month:number, year:number})=>{
    console.log("month", month);
    console.log("year", year);
    try {
        const response = await api.get(`/stats/pnl/sold?timeframe=${timeframe}&month=${month}&year=${year}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//analytics routes

export const getAnalyticsVolume = async(timeframe:"day"|"week"|"month"|"year" = "day")=>{
    try {
        const response = await api.get(`/stats/analytics/volume?timeframe=${timeframe}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAnalyticsRaffles = async(days:number=7)=>{
    try {
        const response = await api.get(`/stats/analytics/raffles?days=${days}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAnalyticsPurchases = async(days:number=7)=>{
    try {
        const response = await api.get(`/stats/analytics/purchases?days=${days}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAnalyticsAverageTickets = async(timeframe:"day"|"week"|"month"|"year" = "day")=>{
    try {
        const response = await api.get(`/stats/analytics/tickets?timeframe=${timeframe}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAnalyticsUniqueBuyers = async(timeframe:"day"|"week"|"month"|"year" = "year")=>{
    try {
        const response = await api.get(`/stats/analytics/unique-buyers?timeframe=${timeframe}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAnalyticsRaffleType = async(timeframe:"day"|"week"|"month"|"year" = "year")=>{
    try {
        const response = await api.get(`/stats/analytics/raffle-types?timeframe=${timeframe}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}