import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useGumballAnchorProgram } from "./useGumballAnchorProgram";
import {toast} from "react-toastify";
import { cancelGumballOverBackend, getCancelAndClaimGumballTx } from "../api/routes/gumballRoutes";
import { useRouter } from "@tanstack/react-router";
import { useCheckAuth } from "./useCheckAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection } from "./helpers";
import { Transaction } from "@solana/web3.js";
export const useCancelGumball = () => {
    // const { cancelAndClaimSelectedPrizesMutation } = useGumballAnchorProgram();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { publicKey, sendTransaction } = useWallet();
    const { checkAndInvalidateToken } = useCheckAuth();

    const validateForm = async (args: { gumballId: number; prizeIndexes: number[] }) => {
        try {
            if (!publicKey) {
                throw new Error("Wallet not connected");
            }
            const isValid = await checkAndInvalidateToken(publicKey.toBase58());
            if (!isValid) {
                throw new Error("Signature verification failed");
            }
            if (!args.gumballId) {
                throw new Error("Gumball ID is required");
            }
            // if (!args.prizeIndexes || args.prizeIndexes.length === 0) {
            //     throw new Error("At least one prize index must be selected");
            // }

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

    const cancelGumball = useMutation({
        mutationKey: ["cancelGumball"],
        mutationFn: async (args: {
            gumballId: number;
            prizeIndexes: number[];
        }) => {
            if (!(await validateForm(args))) {
                throw new Error("Validation failed");
            }
            const { base64Transaction, minContextSlot, blockhash, lastValidBlockHeight } = await getCancelAndClaimGumballTx(args.gumballId, args.prizeIndexes);
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
            const response = await cancelGumballOverBackend(args.gumballId.toString(), signature);
            if (response.error) {
                throw new Error(response.error);
            }
            return args.gumballId;
        },
        onSuccess: (gumballId: number) => {
            queryClient.invalidateQueries({ queryKey: ["gumballs", gumballId.toString()] });
            queryClient.invalidateQueries({ queryKey: ["gumball", gumballId.toString()] });
            toast.success("Gumball cancelled successfully");
            router.navigate({ to: "/gumballs" });
        },
        onError: (error: Error) => {
            console.error(error);
            if (error.message !== "Validation failed") {
                toast.error("Gumball cancelled failed");
            }
        },
    });
    return { cancelGumball };
}