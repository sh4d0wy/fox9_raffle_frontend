import type { AddMultiplePrizesTypeBackend, AddPrizeTypeBackend, GumballBackendType } from "../../types/backend/gumballTypes";
import { api } from "..";

export const createGumballOverBackend = async (gumball: GumballBackendType) => {
    try {
        const response = await api.post("/gumball/create", gumball, {
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

export const confirmGumballCreation = async (gumballId: string, txSignature: string) => {
    try {
        const response = await api.post(`/gumball/confirm/${gumballId}`, {
            txSignature
        }, {
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

export const deleteGumballOverBackend = async (gumballId: string) => {
    try {
        const response = await api.delete(`/gumball/delete/${gumballId}`, {
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

export const addSinglePrizeToGumball = async (gumballId: string, prize: AddPrizeTypeBackend) => {
    try {
        const response = await api.post(`/gumball/addprize/${gumballId}`, prize, {
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

export const addMultiplePrizesToGumball = async (gumballId: string, prizes: AddMultiplePrizesTypeBackend) => {
    try {
        const response = await api.post(`/gumball/addprizes/${gumballId}`, prizes, {
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

export const cancelGumballOverBackend = async (gumballId: string, txSignature: string) => {
    try {
        const response = await api.post(`/gumball/cancel/${gumballId}`, {
            txSignature
        }, {
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

export const getGumballs = async (page: number, limit: number) => {
    try {
        const response = await api.get(`/gumball?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getGumballById = async (id: string) => {
    try {
        const response = await api.get(`/gumball/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const prepareSpin = async (gumballId: string) => {
    try {
        const response = await api.get(`/gumball/prepare-spin/${gumballId}`, {
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

export const spinGumball = async (gumballId: string, txSignature: string) => {
    try {
        const response = await api.post(`/gumball/spin/${gumballId}`, {
            txSignature        }, {
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

export const claimPrize = async (gumballId: string, txSignature: string, prizeIndex: number, spinId: number) => {
    try {
        const response = await api.post(`/gumball/claim/${gumballId}`, {
            txSignature,
            prizeIndex,
            spinId
        }, {
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

export const creatorClaimPrizeBack = async (gumballId: string, txSignature: string) => {
    try {
        const response = await api.post(`/gumball/creator-claim/${gumballId}`, {
            txSignature,
        }, {
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

export const getSpinGumballTx = async (gumballId: string) => {
    try {
        const response = await api.get(`/gumball/spin-tx/${gumballId}`, {
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

type claimGumballResponse = {
    prizeIndex:number,
    base64Transaction:string,
    minContextSlot:number,
    blockhash:string,
    lastValidBlockHeight:number,
    message: string,
  }

export const getClaimGumballTx = async (gumballId: string, spinId: string): Promise<claimGumballResponse> => {
    try {
        const response = await api.get(`/gumball/claim-tx/${gumballId}?spinId=${spinId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
        return response.data as claimGumballResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

type createGumballArgs = {
    startTime: number,
    endTime: number,
    totalTickets: number,
    ticketPrice: number,
    isTicketSol: boolean,
    startGumball: boolean,
    ticketMint: string,
}

export const getCreateGumballTx = async (args: createGumballArgs) => {
    try {
        const response = await api.post("/gumball/create-tx", args, {
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

export const getCancelAndClaimGumballTx = async (gumballId: number, prizeIndexes: number[]) => {
    try {
        const response = await api.post("/gumball/cancelandclaim-tx",
            {
                gumballId,
                prizeIndexes
            }, {
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

type OnChainPrizeInput = {
    prizeIndex: number;
    prizeAmount: number;
    quantity: number;
    prizeMint: string;
};

export const getAddMultiplePrizesTx = async (gumballId: number, prizes: OnChainPrizeInput[]) => {
    try {
        const response = await api.post("/gumball/add-multiple-prizes-tx",
            {
                gumballId,
                prizes
            }, {
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

type PrizeData = {
    prizeIndex: number;
}

export const getClaimBackMultiplePrizesTx = async (gumballId: number, prizes: PrizeData[]) => {
    try {
        const response = await api.post("/gumball/claim-multiple-prizes-back-tx",
            {
                gumballId,
                prizes
            }, {
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