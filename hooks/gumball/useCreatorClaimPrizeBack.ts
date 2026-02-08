import { useMutation } from "@tanstack/react-query";
// import { useGumballAnchorProgram } from "./useGumballAnchorProgram";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useWallet } from "@solana/wallet-adapter-react";
import { creatorClaimPrizeBack, getClaimBackMultiplePrizesTx } from "../../api/routes/gumballRoutes";
import { useCheckAuth } from "../useCheckAuth";
import { Transaction } from "@solana/web3.js";
import { connection } from "../helpers";

export const useCreatorClaimPrizeBack = () => {
    const router = useRouter();
    // const { claimMultiplePrizesBackMutation } = useGumballAnchorProgram();
    const { publicKey, sendTransaction } = useWallet();
    const queryClient = useQueryClient();
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

    const creatorClaimPrizeBackMutation = useMutation({
        mutationKey: ["creatorClaimPrizeBack"],
        mutationFn: async (args: {
            gumballId: number;
            prizeIndexes: number[];
        }) => {
            if (!(await validateForm(args))) {
                throw new Error("Validation failed");
            }
            const { base64Transaction, minContextSlot, blockhash, lastValidBlockHeight } = await getClaimBackMultiplePrizesTx(
                args.gumballId,
                args.prizeIndexes.map((prizeIndex) => { return { prizeIndex: prizeIndex } }),
            );
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

            const response = await creatorClaimPrizeBack(args.gumballId.toString(), signature);
            if (response.error) {
                throw new Error(response.error);
            }
            return args.gumballId;
        },
        onSuccess: (gumballId: number) => {
            queryClient.invalidateQueries({ queryKey: ["gumball", gumballId.toString()] });
            toast.success("Prize claimed successfully");
            router.navigate({ to: "/gumballs" });
        },
        onError: (error: Error) => {
            if (error.message !== "Validation failed") {
                toast.error("Failed to claim prize");
            }
        },
    });
    return { creatorClaimPrizeBackMutation };
}