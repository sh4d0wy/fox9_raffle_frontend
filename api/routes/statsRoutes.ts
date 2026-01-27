import { api } from "..";

export const getRafflerLeaderboard = async()=>{
    try {
        const response = await api.get(`/stats/leaderboard/rafflers`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getRaffleBuyerLeaderboard = async()=>{
    try {
        const response = await api.get(`/stats/leaderboard/buyers`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getBoughtPnl = async(timeframe:string="daily")=>{
    try {
        const response = await api.get(`/stats/pnl/bought?timeframe=${timeframe}`,{
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

export const getSoldPnl = async(timeframe:string="daily")=>{
    try {
        const response = await api.get(`/stats/pnl/sold?timeframe=${timeframe}`,{
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