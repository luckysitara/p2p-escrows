"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor"
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token"
import { useMemo, useCallback } from "react"
import idl from "../config/idl.json"

const PROGRAM_ID = new PublicKey("6NKNtHYLCLmUpBqNDhhxycwUPZxjiZEimm9HddcALKRk")
const NATIVE_MINT = new PublicKey("So11111111111111111111111111111111111111112") // Wrapped SOL

export interface EscrowAccount {
  seed: BN
  maker: PublicKey
  mintA: PublicKey
  mintB: PublicKey
  receiveAmount: BN
  expiry: BN
  isMutable: boolean
  escrowBump: number
  vaultBump: number
}

export function useEscrowProgram() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return null
    }
    return new AnchorProvider(connection, wallet as any, {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    })
  }, [connection, wallet])

  const program = useMemo(() => {
    if (!provider) return null
    return new Program(idl as any, PROGRAM_ID, provider)
  }, [provider])

  const getEscrowPDA = useCallback((maker: PublicKey, seed: number) => {
    const seedBN = new BN(seed)
    return PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), maker.toBuffer(), seedBN.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID,
    )
  }, [])

  const getVaultPDA = useCallback((escrow: PublicKey) => {
    return PublicKey.findProgramAddressSync([Buffer.from("escrow_vault"), escrow.toBuffer()], PROGRAM_ID)
  }, [])

  const fundMilestone = useCallback(
    async (freelancerAddress: string, amount: number, seed: number): Promise<string> => {
      if (!program || !provider) {
        throw new Error("Wallet not connected or program not initialized")
      }

      try {
        const maker = provider.wallet.publicKey
        const taker = new PublicKey(freelancerAddress)
        const mintA = NATIVE_MINT
        const mintB = NATIVE_MINT

        const seedBN = new BN(seed)
        const amountLamports = new BN(amount * LAMPORTS_PER_SOL)
        const duration = new BN(30 * 24 * 60 * 60) // 30 days in seconds

        // Derive PDAs
        const [escrow] = getEscrowPDA(maker, seed)
        const [vault] = getVaultPDA(escrow)

        const makerAtaA = await getAssociatedTokenAddress(mintA, maker)

        // Check if ATA exists, create if not
        const transaction = new Transaction()
        const accountInfo = await connection.getAccountInfo(makerAtaA)

        if (!accountInfo) {
          transaction.add(createAssociatedTokenAccountInstruction(maker, makerAtaA, maker, mintA))
        }

        const tx = await program.methods
          .make(seedBN, amountLamports, duration, true)
          .accounts({
            maker,
            mintA,
            mintB,
            makerAtaA,
            escrow,
            vault,
            systemProgram: SystemProgram.programId,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc({
            commitment: "confirmed",
            skipPreflight: false,
          })

        await connection.confirmTransaction(tx, "confirmed")
        return escrow.toString()
      } catch (error: any) {
        console.error("Error funding milestone:", error)

        // Enhanced error handling
        if (error.message?.includes("insufficient funds")) {
          throw new Error("Insufficient SOL balance to fund this milestone")
        } else if (error.message?.includes("User rejected")) {
          throw new Error("Transaction was rejected by user")
        } else if (error.logs) {
          const errorLog = error.logs.find((log: string) => log.includes("Error:"))
          if (errorLog) {
            throw new Error(`Program error: ${errorLog}`)
          }
        }

        throw new Error(`Failed to fund milestone: ${error.message || "Unknown error"}`)
      }
    },
    [program, provider, connection, getEscrowPDA, getVaultPDA],
  )

  const claimPayment = useCallback(
    async (escrowAddress: string, clientAddress: string): Promise<void> => {
      if (!program || !provider) {
        throw new Error("Wallet not connected or program not initialized")
      }

      try {
        const taker = provider.wallet.publicKey
        const maker = new PublicKey(clientAddress)
        const escrow = new PublicKey(escrowAddress)
        const mintA = NATIVE_MINT
        const mintB = NATIVE_MINT

        const [vault] = getVaultPDA(escrow)

        const makerAtaA = await getAssociatedTokenAddress(mintA, maker)
        const makerAtaB = await getAssociatedTokenAddress(mintB, maker)
        const takerAtaA = await getAssociatedTokenAddress(mintA, taker)
        const takerAtaB = await getAssociatedTokenAddress(mintB, taker)

        // Create ATAs if they don't exist
        const transaction = new Transaction()
        const accounts = [
          { ata: makerAtaA, owner: maker },
          { ata: makerAtaB, owner: maker },
          { ata: takerAtaA, owner: taker },
          { ata: takerAtaB, owner: taker },
        ]

        for (const { ata, owner } of accounts) {
          const accountInfo = await connection.getAccountInfo(ata)
          if (!accountInfo) {
            transaction.add(
              createAssociatedTokenAccountInstruction(
                taker, // payer
                ata,
                owner,
                owner === maker ? mintA : mintB,
              ),
            )
          }
        }

        const tx = await program.methods
          .take()
          .accounts({
            maker,
            taker,
            mintA,
            mintB,
            makerAtaA,
            makerAtaB,
            takerAtaA,
            takerAtaB,
            escrow,
            vault,
            systemProgram: SystemProgram.programId,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc({
            commitment: "confirmed",
            skipPreflight: false,
          })

        await connection.confirmTransaction(tx, "confirmed")
      } catch (error: any) {
        console.error("Error claiming payment:", error)

        if (error.message?.includes("User rejected")) {
          throw new Error("Transaction was rejected by user")
        } else if (error.logs) {
          const errorLog = error.logs.find((log: string) => log.includes("Error:"))
          if (errorLog) {
            throw new Error(`Program error: ${errorLog}`)
          }
        }

        throw new Error(`Failed to claim payment: ${error.message || "Unknown error"}`)
      }
    },
    [program, provider, connection, getVaultPDA],
  )

  const refundMilestone = useCallback(
    async (escrowAddress: string): Promise<void> => {
      if (!program || !provider) {
        throw new Error("Wallet not connected or program not initialized")
      }

      try {
        const maker = provider.wallet.publicKey
        const escrow = new PublicKey(escrowAddress)
        const mintA = NATIVE_MINT

        const [vault] = getVaultPDA(escrow)
        const makerAtaA = await getAssociatedTokenAddress(mintA, maker)

        const tx = await program.methods
          .cancel()
          .accounts({
            maker,
            mintA,
            makerAtaA,
            vault,
            escrow,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc({
            commitment: "confirmed",
            skipPreflight: false,
          })

        await connection.confirmTransaction(tx, "confirmed")
      } catch (error: any) {
        console.error("Error refunding milestone:", error)

        if (error.message?.includes("User rejected")) {
          throw new Error("Transaction was rejected by user")
        } else if (error.logs) {
          const errorLog = error.logs.find((log: string) => log.includes("Error:"))
          if (errorLog) {
            throw new Error(`Program error: ${errorLog}`)
          }
        }

        throw new Error(`Failed to refund milestone: ${error.message || "Unknown error"}`)
      }
    },
    [program, provider, connection, getVaultPDA],
  )

  const getEscrowAccount = useCallback(
    async (escrowAddress: string): Promise<EscrowAccount | null> => {
      if (!program) return null

      try {
        const escrow = new PublicKey(escrowAddress)
        const account = await program.account.escrow.fetch(escrow)
        return account as EscrowAccount
      } catch (error) {
        console.error("Error fetching escrow account:", error)
        return null
      }
    },
    [program],
  )

  const updateEscrow = useCallback(
    async (
      escrowAddress: string,
      newTakerToken: string,
      offerAmount: number,
      expiry: number,
      isMutable: boolean,
    ): Promise<void> => {
      if (!program || !provider) {
        throw new Error("Wallet not connected or program not initialized")
      }

      try {
        const maker = provider.wallet.publicKey
        const escrow = new PublicKey(escrowAddress)
        const newTakerTokenPubkey = new PublicKey(newTakerToken)

        const offerAmountBN = new BN(offerAmount * LAMPORTS_PER_SOL)
        const expiryBN = new BN(expiry)

        const tx = await program.methods
          .update(offerAmountBN, expiryBN, isMutable)
          .accounts({
            maker,
            newTakerToken: newTakerTokenPubkey,
            escrow,
          })
          .rpc({
            commitment: "confirmed",
            skipPreflight: false,
          })

        await connection.confirmTransaction(tx, "confirmed")
      } catch (error: any) {
        console.error("Error updating escrow:", error)
        throw new Error(`Failed to update escrow: ${error.message || "Unknown error"}`)
      }
    },
    [program, provider, connection],
  )

  return {
    fundMilestone,
    claimPayment,
    refundMilestone,
    getEscrowAccount,
    updateEscrow,
    getEscrowPDA,
    getVaultPDA,
    isConnected: !!provider,
    programId: PROGRAM_ID.toString(),
  }
}
