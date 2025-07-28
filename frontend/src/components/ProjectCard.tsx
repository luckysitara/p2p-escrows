"use client"
import { useWallet } from "@solana/wallet-adapter-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Wallet, TrendingUp, Clock, MoreVertical, Edit, Share2 } from "lucide-react"
import { MilestoneCard } from "./MilestoneCard"
import { type Project, MilestoneStatus, ProjectStatus } from "../types"
import { formatAddress, formatAmount, formatRelativeTime } from "@/lib/utils"
import { useState } from "react"

interface ProjectCardProps {
  project: Project
  onUpdate: (project: Project) => void
  viewMode?: "grid" | "list"
}

export function ProjectCard({ project, onUpdate, viewMode = "grid" }: ProjectCardProps) {
  const { publicKey } = useWallet()
  const [showAllMilestones, setShowAllMilestones] = useState(false)

  const isClient = publicKey?.toString() === project.clientAddress
  const isFreelancer = publicKey?.toString() === project.freelancerAddress

  const totalAmount = project.milestones.reduce((sum, milestone) => sum + milestone.amount, 0)
  const completedAmount = project.milestones
    .filter((m) => m.status === MilestoneStatus.Completed)
    .reduce((sum, milestone) => sum + milestone.amount, 0)
  const fundedAmount = project.milestones
    .filter((m) => m.status === MilestoneStatus.Funded)
    .reduce((sum, milestone) => sum + milestone.amount, 0)

  const progress = totalAmount > 0 ? (completedAmount / totalAmount) * 100 : 0
  const completedMilestones = project.milestones.filter((m) => m.status === MilestoneStatus.Completed).length
  const totalMilestones = project.milestones.length

  const updateMilestone = (milestoneId: string, status: MilestoneStatus, escrowAccount?: string) => {
    const updatedProject = {
      ...project,
      milestones: project.milestones.map((milestone) =>
        milestone.id === milestoneId
          ? {
              ...milestone,
              status,
              escrowAccount: escrowAccount || milestone.escrowAccount,
              fundedAt: status === MilestoneStatus.Funded ? new Date().toISOString() : milestone.fundedAt,
              completedAt: status === MilestoneStatus.Completed ? new Date().toISOString() : milestone.completedAt,
            }
          : milestone,
      ),
      updatedAt: new Date().toISOString(),
      completedAmount: project.milestones
        .filter((m) =>
          m.id === milestoneId ? status === MilestoneStatus.Completed : m.status === MilestoneStatus.Completed,
        )
        .reduce((sum, m) => sum + m.amount, 0),
      fundedAmount: project.milestones
        .filter((m) => (m.id === milestoneId ? status === MilestoneStatus.Funded : m.status === MilestoneStatus.Funded))
        .reduce((sum, m) => sum + m.amount, 0),
    }
    onUpdate(updatedProject)
  }

  const getRoleColor = () => {
    if (isClient) return "from-blue-500 to-blue-600"
    if (isFreelancer) return "from-green-500 to-green-600"
    return "from-slate-500 to-slate-600"
  }

  const getRoleIcon = () => {
    if (isClient) return <User className="w-3 h-3" />
    if (isFreelancer) return <Wallet className="w-3 h-3" />
    return <Clock className="w-3 h-3" />
  }

  const getStatusColor = () => {
    switch (project.status) {
      case ProjectStatus.Active:
        return "from-green-500 to-green-600"
      case ProjectStatus.Completed:
        return "from-blue-500 to-blue-600"
      case ProjectStatus.Cancelled:
        return "from-red-500 to-red-600"
      case ProjectStatus.OnHold:
        return "from-yellow-500 to-yellow-600"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  const getPriorityColor = () => {
    switch (project.priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const visibleMilestones = showAllMilestones ? project.milestones : project.milestones.slice(0, 3)
  const hasMoreMilestones = project.milestones.length > 3

  return (
    <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.3, ease: "easeOut" }} className="h-full">
      <Card
        className={`h-full bg-white/70 backdrop-blur-sm border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden ${
          viewMode === "list" ? "flex" : ""
        }`}
      >
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

        <div className={`relative z-10 ${viewMode === "list" ? "flex w-full" : ""}`}>
          <CardHeader className={viewMode === "list" ? "flex-shrink-0 w-80" : ""}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  {project.priority && (
                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor()}`}>{project.priority}</Badge>
                  )}
                </div>

                {project.description && (
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">{project.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatRelativeTime(project.createdAt)}
                  </div>
                  {project.category && (
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                  <Badge className={`bg-gradient-to-r ${getRoleColor()} text-white shadow-lg border-0`}>
                    <span className="flex items-center gap-1">
                      {getRoleIcon()}
                      {isClient ? "Client" : isFreelancer ? "Freelancer" : "Observer"}
                    </span>
                  </Badge>
                </motion.div>

                <Badge className={`bg-gradient-to-r ${getStatusColor()} text-white shadow-lg border-0`}>
                  {project.status}
                </Badge>
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Progress</span>
                </div>
                <div className="text-lg font-bold text-blue-800">{progress.toFixed(0)}%</div>
                <div className="text-xs text-blue-600">
                  {completedMilestones}/{totalMilestones} milestones
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Value</span>
                </div>
                <div className="text-lg font-bold text-green-800">{formatAmount(totalAmount)} SOL</div>
                <div className="text-xs text-green-600">{formatAmount(completedAmount)} completed</div>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-slate-600 font-medium">Client:</span>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded-md font-mono">
                  {formatAddress(project.clientAddress)}
                </code>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-600 font-medium">Freelancer:</span>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded-md font-mono">
                  {formatAddress(project.freelancerAddress)}
                </code>
              </div>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent className={`space-y-4 ${viewMode === "list" ? "flex-1" : ""}`}>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700">Overall Progress</span>
                <span className="text-slate-600">
                  {formatAmount(completedAmount)} / {formatAmount(totalAmount)} SOL
                </span>
              </div>
              <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                {fundedAmount > 0 && (
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60"
                    initial={{ width: 0 }}
                    animate={{ width: `${((completedAmount + fundedAmount) / totalAmount) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                )}
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Completed: {formatAmount(completedAmount)} SOL</span>
                <span>Funded: {formatAmount(fundedAmount)} SOL</span>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                  Milestones ({totalMilestones})
                </h4>
                {hasMoreMilestones && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllMilestones(!showAllMilestones)}
                    className="text-xs"
                  >
                    {showAllMilestones ? "Show Less" : `Show All (${project.milestones.length})`}
                  </Button>
                )}
              </div>

              <div className={`space-y-3 ${viewMode === "list" ? "max-h-64 overflow-y-auto" : ""}`}>
                {visibleMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MilestoneCard
                      milestone={milestone}
                      index={index}
                      isClient={isClient}
                      isFreelancer={isFreelancer}
                      project={project}
                      onUpdate={updateMilestone}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {(isClient || isFreelancer) && (
              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}
