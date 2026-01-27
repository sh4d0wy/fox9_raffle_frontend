import { useMutation } from "@tanstack/react-query";
import type { AddMultiplePrizesTypeBackend, PrizeDataBackend } from "../types/backend/gumballTypes";
import { addMultiplePrizesToGumball, getAddMultiplePrizesTx } from "../api/routes/gumballRoutes";
import {toast} from "react-toastify";
// import { PublicKey } from "@solana/web3.js";
// import { useGumballAnchorProgram } from "./useGumballAnchorProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCheckAuth } from "./useCheckAuth";
import { connection } from "./helpers";
import { Transaction } from "@solana/web3.js";

type OnChainPrizeInput = {
    prizeIndex: number;
    prizeAmount: number;
    quantity: number;
    prizeMint: string;
};

export type AddPrizeInputData = {
    prizeIndex: number;
    isNft: boolean;
    mint: string;
    name?: string;
    symbol?: string;
    image?: string;
    decimals?: number;
    prizeAmount: number; 
    quantity: number;
    floorPrice?: string;
};

export const useAddPrizes = () => {
    // const { addMultiplePrizesMutation } = useGumballAnchorProgram();
    const { checkAndInvalidateToken } = useCheckAuth();
    const { publicKey, sendTransaction } = useWallet();

    const validateForm = async (args: { gumballId: string; prizes: AddPrizeInputData[] }) => {
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
            if (args.prizes.length === 0) {
                throw new Error("At least one prize must be added");
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
    
    const addPrizes = useMutation({
        mutationKey: ["addPrizes"],
        mutationFn: async (args: {
            gumballId: string;
            prizes: AddPrizeInputData[];
        }) => {
            if (!(await validateForm(args))) {
                throw new Error("Validation failed");
            }
            console.log("gumballId", args.gumballId);
            console.log("Input prizes:", args.prizes);
            const onChainPrizes: OnChainPrizeInput[] = args.prizes.map((prize) => {
                console.log("Processing prize:", prize);
                console.log("Processing prize with mint:", prize.mint);
                return {
                    prizeIndex: prize.prizeIndex,
                    prizeAmount: prize.isNft ? 1 : (prize.prizeAmount > 0 ? prize.prizeAmount : 1),
                    quantity: prize.quantity,
                    prizeMint: prize.mint,
                };
            });
            console.log("onChainPrizes", onChainPrizes);

            const { base64Transaction, minContextSlot, blockhash, lastValidBlockHeight } = await getAddMultiplePrizesTx(parseInt(args.gumballId), onChainPrizes);
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

            const backendPrizes: PrizeDataBackend[] = args.prizes.map((prize) => ({
                prizeIndex: prize.prizeIndex,
                isNft: prize.isNft,
                mint: prize.mint,
                name: prize.name,
                symbol: prize.symbol,
                image: prize.image,
                decimals: prize.decimals,
                totalAmount: String(prize.prizeAmount * prize.quantity),
                prizeAmount: String(prize.prizeAmount),
                quantity: prize.quantity,
                floorPrice: prize.floorPrice,
            }));

            const backendPayload: AddMultiplePrizesTypeBackend = {
                prizes: backendPrizes,
                txSignature: signature,
            };

            const response = await addMultiplePrizesToGumball(args.gumballId, backendPayload);
            if (response.error) {
                throw new Error(response.error);
            }
            
            return { txSignature: signature, backendResponse: response };
        },
        onSuccess: () => {
            toast.success("Prizes added successfully");
        },
        onError: (error: Error) => {
            console.error(error);
            if (error.message !== "Validation failed") {
                toast.error("Failed to add prizes");
            }
        },
    });
    
    return { addPrizes };
};