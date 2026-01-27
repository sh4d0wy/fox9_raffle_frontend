import {api} from "../";

export const getWinnningNotifications = async()=>{
    try {
        const response = await api.get(`/notifications/winnings`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getEndedRafflesNotifications = async()=>{
    try {
        const response = await api.get(`/notifications/ended-raffles`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}