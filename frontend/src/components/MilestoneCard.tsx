"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, CheckCircle, XCircle, Loader2, Zap } from "lucide-react"
import { toast } from "sonner"
import { type Milestone, MilestoneStatus, type Project } from "../types"
import { useEscrowProgram } from "../hooks/useEscrowProgram"

interface MilestoneCardProps {
  milestone: Milestone
  index: number
  isClient: boolean
  isFreelancer: boolean
  project: Project
  onUpdate: (milestoneId: string, status: MilestoneStatus, escrowAccount?: string) => void
}

export function MilestoneCard({ milestone, index, isClient, isFreelancer, project, onUpdate }: MilestoneCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { fundMilestone, claimPayment, refundMilestone } = useEscrowProgram()

  const getStatusConfig = () => {
    switch (milestone.status) {
      case MilestoneStatus.Upcoming:
        return {
          icon: Clock,
          color: "from-slate-500 to-slate-600",
          bgColor: "from-slate-50 to-slate-100",
          textColor: "text-slate-700",
        }
      case MilestoneStatus.Funded:
        return {
          icon: DollarSign,
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-100",
          textColor: "text-orange-700",
        }
      case MilestoneStatus.Completed:
        return {
          icon: CheckCircle,
          color: "from-green-500 to-emerald-500",
          bgColor: "from-green-50 to-emerald-100",
          textColor: "text-green-700",
        }
      case MilestoneStatus.Cancelled:
        return {
          icon: XCircle,
          color: "from-red-500 to-red-600",
          bgColor: "from-red-50 to-red-100",
          textColor: "text-red-700",
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  const handleFund = async () => {
    setIsLoading(true)
    const loadingToast = toast.loading("Funding milestone...", {
      description: "Please confirm the transaction in your wallet",
    })

    try {
      const escrowAccount = await fundMilestone(project.freelancerAddress, milestone.amount, index)
      onUpdate(milestone.id, MilestoneStatus.Funded, escrowAccount)

      toast.dismiss(loadingToast)
      toast.success(`Milestone ${index + 1} funded successfully!`, {
        description: `${milestone.amount} SOL has been escrowed`,
        action: {
          label: "View",
          onClick: () => console.log("View transaction"),
        },
      })
    } catch (error) {
      console.error("Error funding milestone:", error)
      toast.dismiss(loadingToast)
      toast.error("Failed to fund milestone", {
        description: "Please try again or check your wallet connection",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    if (!milestone.escrowAccount) {
      toast.error("No escrow account found for this milestone")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("Claiming payment...", {
      description: "Please confirm the transaction in your wallet",
    })

    try {
      await claimPayment(milestone.escrowAccount, project.clientAddress)
      onUpdate(milestone.id, MilestoneStatus.Completed)

      toast.dismiss(loadingToast)
      toast.success(`Payment claimed successfully!`, {
        description: `${milestone.amount} SOL has been transferred to your wallet`,
        action: {
          label: "View",
          onClick: () => console.log("View transaction"),
        },
      })
    } catch (error) {
      console.error("Error claiming payment:", error)
      toast.dismiss(loadingToast)
      toast.error("Failed to claim payment", {
        description: "Please try again or check your wallet connection",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!milestone.escrowAccount) {
      toast.error("No escrow account found for this milestone")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("Processing refund...", {
      description: "Please confirm the transaction in your wallet",
    })

    try {
      await refundMilestone(milestone.escrowAccount)
      onUpdate(milestone.id, MilestoneStatus.Cancelled)

      toast.dismiss(loadingToast)
      toast.success(`Milestone refunded successfully!`, {
        description: `${milestone.amount} SOL has been returned to your wallet`,
        action: {
          label: "View",
          onClick: () => console.log("View transaction"),
        },
      })
    } catch (error) {
      console.error("Error refunding milestone:", error)
      toast.dismiss(loadingToast)
      toast.error("Failed to process refund", {
        description: "Please try again or check your wallet connection",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderActionButton = () => {
    if (milestone.status === MilestoneStatus.Upcoming && isClient) {
      return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            onClick={handleFund}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Funding...
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 mr-1" />
                Fund
              </>
            )}
          </Button>
        </motion.div>
      )
    }

    if (milestone.status === MilestoneStatus.Funded && isClient) {
      return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefund}
            disabled={isLoading}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 bg-transparent"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Refunding...
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Refund
              </>
            )}
          </Button>
        </motion.div>
      )
    }

    if (milestone.status === MilestoneStatus.Funded && isFreelancer) {
      return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            onClick={handleClaim}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Claim Payment
              </>
            )}
          </Button>
        </motion.div>
      )
    }

    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ x: 4 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
        {/* Status indicator line */}
        <div className={`h-1 bg-gradient-to-r ${statusConfig.color}`} />

        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${statusConfig.bgColor} shadow-sm`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {milestone.title}
                  </h5>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`bg-gradient-to-r ${statusConfig.color} text-white text-xs border-0 shadow-sm`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Amount:</span>
                  <span className="font-bold text-slate-800">{milestone.amount} SOL</span>
                </div>

                {milestone.escrowAccount && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Escrow:</span>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                      {milestone.escrowAccount.slice(0, 8)}...{milestone.escrowAccount.slice(-8)}
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className="ml-4 flex-shrink-0">{renderActionButton()}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
