import { useMutation } from "@tanstack/react-query";
import { claimTicketRaffle, claimPrizeBackTx } from "../api/routes/raffleRoutes";
import {toast} from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { connection } from "./helpers";
import { Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCheckAuth } from "./useCheckAuth";

export const useClaimTicketRaffle = () => {
    const queryClient = useQueryClient();
    const { publicKey, sendTransaction } = useWallet();
    const { checkAndInvalidateToken } = useCheckAuth();

    const validateForm = async (raffleId: number) => {
        try {
            if (!publicKey) {
                throw new Error("Wallet not connected");
            }
            const isValid = await checkAndInvalidateToken(publicKey.toBase58());
            if (!isValid) {
                throw new Error("Signature verification failed");
            }
            if (!raffleId) {
                throw new Error("Raffle ID is required");
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

    };

    const claimTicket = useMutation({
        mutationFn: async (raffleId: number) => {
            if (!(await validateForm(raffleId))) {
                throw new Error("Validation failed");
            }
            const { base64Transaction, minContextSlot, blockhash, lastValidBlockHeight } = await claimPrizeBackTx(raffleId.toString());
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
                throw new Error("Failed to claim ticket amount");
            }
            const response = await claimTicketRaffle(raffleId, signature);
            if (response.error) {
                throw new Error(response.error);
            }
            return raffleId;
        },
        onSuccess: (raffleId: number) => {
            queryClient.invalidateQueries({ queryKey: ["raffle", raffleId.toString()] });
            queryClient.invalidateQueries({ queryKey: ["profile-raffle-created", publicKey?.toBase58()] });
            toast.success("Ticket amount claimed successfully");
        },
        onError: (error: Error) => {
            console.error(error);
            if (error.message !== "Validation failed") {
                toast.error("Failed to claim ticket amount");
            }
        },
    });
    return { claimTicket };
}