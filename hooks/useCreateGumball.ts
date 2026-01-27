import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGumballAnchorProgram } from "./useGumballAnchorProgram";
import { toast } from "react-toastify";
import { PublicKey, Transaction } from "@solana/web3.js";
// import type { GumballBackendType } from "../types/backend/gumballTypes";
// import { createGumballSchema } from "../types/backend/gumballTypes";
import { createGumballOverBackend, getCreateGumballTx } from "../api/routes/gumballRoutes";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGumballStore } from "../store/useGumballStore";
import { useRouter } from "@tanstack/react-router";
import { useCheckAuth } from "./useCheckAuth";
import { WRAPPED_SOL_MINT } from "@/constants";
import { connection } from "./helpers";


export const useCreateGumball = () => {
    //TODO: Add activation logic from contract if the gumball starting immediately
    const queryClient = useQueryClient();
    const { publicKey, sendTransaction } = useWallet();
    const { setCreatedGumballId, setActiveTab } = useGumballStore();
    const router = useRouter();
    const { checkAndInvalidateToken } = useCheckAuth();

    const validateForm = async (args: {
        name: string;
        startTime: number;
        endTime: number;
        totalTickets: number;
        ticketPrice: number;
        isTicketSol: boolean;
        startGumball: boolean;
        ticketMint?: PublicKey;
    }) => {
        try {
            if (!publicKey) {
                throw new Error("Wallet not connected");
            }
            const isValid = await checkAndInvalidateToken(publicKey.toBase58());
       
            if (!isValid) {
                throw new Error("Signature verification failed");
            }
            if (args.name.length === 0) {
                throw new Error("Name is required");
            }
            if (args.startTime <= 0) {
                throw new Error("Start time is required");
            }
            if (args.endTime <= 0) {
                throw new Error("End time is required");
            }
            if (args.totalTickets <= 0) {
                throw new Error("Prize Count must be greater than 0");
            }
            if (args.ticketPrice && args.ticketPrice <= 0) {
                throw new Error("Gumball price must be greater than 0");
            }
            if (!args.isTicketSol && args.ticketMint === undefined) {
                throw new Error("Ticket mint is required");
            }
            if (args.endTime - args.startTime > (24 * 60 * 60 * 7)) {
                throw new Error("Gumball duration must be less than 7 days");
            }
            if (args.endTime - args.startTime < (24 * 60 * 60)) {
                throw new Error("Gumball duration must be equal or greater than 2 days")
            }
            if (args.totalTickets < 3) {
                throw new Error("Prize Count must be greater than 2");
            }
            if (args.totalTickets > 10) {
                throw new Error("Prize Count must be less than or equal to 10");
            }
            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
            return false;
        }
    }
    const { getGumballConfig } = useGumballAnchorProgram();
    const gumballCount = getGumballConfig.data?.gumballCount || 0;
    const createGumball = useMutation({
        mutationKey: ["createGumball"],
        mutationFn: async (args: {
            name: string;
            startTime: number;
            endTime: number;
            totalTickets: number;
            ticketPrice: number;
            isTicketSol: boolean;
            startGumball: boolean;
            // Ticket configuration
            ticketMint?: PublicKey;
        }) => {
            if (!(await validateForm(args))) {
                throw new Error("Validation failed");
            }
            const { base64Transaction, minContextSlot, blockhash, lastValidBlockHeight } = await getCreateGumballTx({
                startTime: args.startTime,
                endTime: args.endTime,
                totalTickets: args.totalTickets,
                ticketPrice: args.ticketPrice,
                isTicketSol: args.isTicketSol,
                startGumball: args.startGumball,
                ticketMint: args.ticketMint ? args.ticketMint.toString() : WRAPPED_SOL_MINT.toString(),
            });
            console.log("Received transaction from backend", base64Transaction);
            const decodedTx = Buffer.from(base64Transaction, "base64");
            const transaction = Transaction.from(decodedTx);

            //Send Transaction
            const signature = await sendTransaction(transaction, connection, {
                minContextSlot,
            });

            const confirmation = await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            });
            if (confirmation.value.err) {
                console.log("Failed to create auction", confirmation.value.err);
                throw new Error("Failed to create auction");
            }

            const response = await createGumballOverBackend({
                id: gumballCount,
                creatorAddress: publicKey?.toBase58().toString() || "",
                name: args.name,
                manualStart: false,
                startTime: new Date((args.startTime * 1000) - 2), //2 sec before start to avoid failure in contract because of time difference
                endTime: new Date((args.endTime) * 1000),
                totalTickets: 0,
                ticketPrice: args.ticketPrice.toString(),
                isTicketSol: args.isTicketSol,
                maxPrizes: args.totalTickets,
                ticketMint: args.ticketMint ? args.ticketMint.toBase58().toString() : undefined,
                txSignature: signature,
            });
            if (response.error) {
                throw new Error(response.error);
            }
            return response.gumball.id;
        },
        onSuccess: (gumballId: number) => {
            queryClient.invalidateQueries({ queryKey: ["gumballs", gumballId.toString()] });
            toast.success("Gumball created successfully");
            setCreatedGumballId(gumballId);
            setActiveTab("loadPrizes");
            router.navigate({ to: "/gumballs/create_gumballs/$id", params: { id: gumballId.toString() } });
        },
        onError: (error: Error) => {
            console.error(error);
            if (error.message !== "Validation failed") {
                toast.error("Failed to create gumball");
            }
        }
    });
    return { createGumball };
}