import { useMutation } from "@tanstack/react-query";
import { prepareSpin, spinGumball, getSpinGumballTx } from "../api/routes/gumballRoutes";
import { Transaction } from "@solana/web3.js";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckAuth } from "./useCheckAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection } from "./helpers";

export const useSpinGumball = () => {
    const queryClient = useQueryClient();
    const { checkAndInvalidateToken } = useCheckAuth();
    const { publicKey, sendTransaction } = useWallet();

    const validateForm = async (args: { gumballId: number; }) => {
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

    const spinGumballFunction = useMutation({
        mutationKey: ["gumball", "spin"],
        mutationFn: async (args: {
            gumballId: number;
        }) => {
            if (!(await validateForm(args))) {
                throw new Error("Validation failed");
            }
            console.log("args", args);
            const { base64Transaction, minContextSlot, blockhash, lastValidBlockHeight } = await getSpinGumballTx(args.gumballId.toString());
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
            const spinResponse = await spinGumball(args.gumballId.toString(), signature.toString());
            if (spinResponse.error) {
                throw new Error(spinResponse.error);
            }
            return args.gumballId;
        },
        onSuccess: (gumballId: number) => {
            queryClient.invalidateQueries({ queryKey: ["gumball", gumballId.toString()] });
            toast.success("Gumball spun successfully");
        },
        onError: (error: Error) => {
            if (error.message !== "Validation failed") {
                toast.error("Failed to spin gumball");
            }
        }
    });
    return { spinGumballFunction };
}   