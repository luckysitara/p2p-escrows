"use client"

import type React from "react"
import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, User, Wallet, Target, DollarSign, Calendar, Tag, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { type Project, type Milestone, MilestoneStatus, ProjectStatus } from "../types"
import { PublicKey } from "@solana/web3.js"
import { formatAmount } from "@/lib/utils"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (project: Project) => void
}

const CATEGORIES = ["Web Development", "Mobile Development", "Design", "Writing", "Marketing", "Consulting", "Other"]

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "text-green-600 bg-green-50" },
  { value: "medium", label: "Medium", color: "text-yellow-600 bg-yellow-50" },
  { value: "high", label: "High", color: "text-red-600 bg-red-50" },
] as const

export function CreateProjectDialog({ open, onOpenChange, onCreateProject }: CreateProjectDialogProps) {
  const { publicKey } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [freelancerAddress, setFreelancerAddress] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [milestones, setMilestones] = useState<Omit<Milestone, "id" | "status" | "escrowAccount">[]>([
    { title: "", amount: 0, description: "", dueDate: "" },
  ])

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addMilestone = () => {
    setMilestones((prev) => [...prev, { title: "", amount: 0, description: "", dueDate: "" }])
  }

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const updateMilestone = (
    index: number,
    field: keyof Omit<Milestone, "id" | "status" | "escrowAccount">,
    value: string | number,
  ) => {
    setMilestones((prev) => prev.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone)))

    // Clear field-specific errors
    if (errors[`milestone-${index}-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`milestone-${index}-${field}`]
        return newErrors
      })
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Project validation
    if (!title.trim()) {
      newErrors.title = "Project title is required"
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!freelancerAddress.trim()) {
      newErrors.freelancerAddress = "Freelancer address is required"
    } else {
      try {
        new PublicKey(freelancerAddress)
      } catch {
        newErrors.freelancerAddress = "Invalid Solana wallet address"
      }
    }

    // Milestone validation
    milestones.forEach((milestone, index) => {
      if (!milestone.title.trim()) {
        newErrors[`milestone-${index}-title`] = "Milestone title is required"
      }
      if (milestone.amount <= 0) {
        newErrors[`milestone-${index}-amount`] = "Amount must be greater than 0"
      }
      if (milestone.amount > 1000) {
        newErrors[`milestone-${index}-amount`] = "Amount seems too high (max 1000 SOL)"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !publicKey) return

    setIsSubmitting(true)

    try {
      const totalAmount = milestones.reduce((sum, milestone) => sum + milestone.amount, 0)

      const project: Project = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim() || undefined,
        clientAddress: publicKey.toString(),
        freelancerAddress: freelancerAddress.trim(),
        milestones: milestones.map((milestone, index) => ({
          id: `${Date.now()}-${index}`,
          title: milestone.title.trim(),
          description: milestone.description?.trim() || undefined,
          amount: milestone.amount,
          status: MilestoneStatus.Upcoming,
          escrowAccount: null,
          dueDate: milestone.dueDate || undefined,
        })),
        status: ProjectStatus.Active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalAmount,
        completedAmount: 0,
        fundedAmount: 0,
        category: category || undefined,
        tags: tags.length > 0 ? tags : undefined,
        priority,
      }

      onCreateProject(project)

      toast.success("Project created successfully!", {
        description: `${milestones.length} milestones • ${formatAmount(totalAmount)} SOL total`,
        action: {
          label: "View Project",
          onClick: () => console.log("Navigate to project"),
        },
      })

      // Reset form
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project", {
        description: "Please try again or check your input",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setFreelancerAddress("")
    setCategory("")
    setPriority("medium")
    setTags([])
    setNewTag("")
    setMilestones([{ title: "", amount: 0, description: "", dueDate: "" }])
    setErrors({})
  }

  const totalAmount = milestones.reduce((sum, milestone) => sum + milestone.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border-white/20">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Set up a new milestone-based project with secure escrow payments
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Project Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: "" }))
                    }
                  }}
                  placeholder="Enter a descriptive project title"
                  className={`bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-300 text-lg py-3 ${
                    errors.title ? "border-red-300 focus:border-red-500" : ""
                  }`}
                  required
                />
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-semibold text-slate-800">
                  Category
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-md focus:bg-white/80 transition-all duration-300"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold text-slate-800">
                Project Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project scope, requirements, and deliverables..."
                rows={4}
                className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-md focus:bg-white/80 transition-all duration-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="freelancer" className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Freelancer Wallet Address *
                </Label>
                <Input
                  id="freelancer"
                  value={freelancerAddress}
                  onChange={(e) => {
                    setFreelancerAddress(e.target.value)
                    if (errors.freelancerAddress) {
                      setErrors((prev) => ({ ...prev, freelancerAddress: "" }))
                    }
                  }}
                  placeholder="Enter freelancer's Solana wallet address"
                  className={`bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-300 font-mono ${
                    errors.freelancerAddress ? "border-red-300 focus:border-red-500" : ""
                  }`}
                  required
                />
                {errors.freelancerAddress && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.freelancerAddress}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold text-slate-800">Priority Level</Label>
                <div className="flex gap-2">
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        priority === option.value
                          ? `${option.color} border-2 border-current`
                          : "bg-white/60 text-slate-600 border border-slate-200 hover:bg-white/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Project Tags (Optional)
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-300"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  disabled={!newTag.trim() || tags.length >= 5}
                  className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80"
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-slate-500">Add up to 5 tags to help categorize your project</p>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Project Milestones *
              </Label>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMilestone}
                  className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </motion.div>
            </div>

            {/* Total Amount Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Project Value:
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatAmount(totalAmount)} SOL
                </span>
              </div>
              {totalAmount > 0 && (
                <div className="mt-2 text-sm text-slate-600">
                  Average per milestone: {formatAmount(totalAmount / milestones.length)} SOL
                </div>
              )}
            </div>

            <AnimatePresence>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="bg-white/70 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Milestone Number */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                          </div>

                          {/* Milestone Details */}
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label
                                  htmlFor={`milestone-title-${index}`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Milestone Title *
                                </Label>
                                <Input
                                  id={`milestone-title-${index}`}
                                  value={milestone.title}
                                  onChange={(e) => updateMilestone(index, "title", e.target.value)}
                                  placeholder={`Milestone ${index + 1} title`}
                                  className={`bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-300 ${
                                    errors[`milestone-${index}-title`] ? "border-red-300 focus:border-red-500" : ""
                                  }`}
                                  required
                                />
                                {errors[`milestone-${index}-title`] && (
                                  <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors[`milestone-${index}-title`]}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label
                                  htmlFor={`milestone-amount-${index}`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Amount (SOL) *
                                </Label>
                                <Input
                                  id={`milestone-amount-${index}`}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="1000"
                                  value={milestone.amount || ""}
                                  onChange={(e) =>
                                    updateMilestone(index, "amount", Number.parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0.00"
                                  className={`bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-300 ${
                                    errors[`milestone-${index}-amount`] ? "border-red-300 focus:border-red-500" : ""
                                  }`}
                                  required
                                />
                                {errors[`milestone-${index}-amount`] && (
                                  <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors[`milestone-${index}-amount`]}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label
                                  htmlFor={`milestone-description-${index}`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Description
                                </Label>
                                <textarea
                                  id={`milestone-description-${index}`}
                                  value={milestone.description || ""}
                                  onChange={(e) => updateMilestone(index, "description", e.target.value)}
                                  placeholder="Describe what needs to be delivered..."
                                  rows={3}
                                  className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-md focus:bg-white/80 transition-all duration-300 resize-none text-sm"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label
                                  htmlFor={`milestone-due-${index}`}
                                  className="text-sm font-medium text-slate-700 flex items-center gap-1"
                                >
                                  <Calendar className="w-3 h-3" />
                                  Due Date
                                </Label>
                                <Input
                                  id={`milestone-due-${index}`}
                                  type="date"
                                  value={milestone.dueDate || ""}
                                  onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                                  className="bg-white/60 backdrop-blur-sm border-white/30 focus:bg-white/80 transition-all duration-300"
                                  min={new Date().toISOString().split("T")[0]}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          {milestones.length > 1 && (
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeMilestone(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              disabled={isSubmitting}
              className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 transition-all duration-300"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={isSubmitting || totalAmount === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
