"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Plus, Briefcase, Search, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CreateProjectDialog } from "./CreateProjectDialog"
import { ProjectCard } from "./ProjectCard"
import { WelcomePage } from "./WelcomePage"
import type { Project } from "../types"

export function ProjectDashboard() {
  const { connected } = useWallet()
  const [projects, setProjects] = useState<Project[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("escrow-projects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("escrow-projects", JSON.stringify(projects))
  }, [projects])

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project])
  }

  const updateProject = (projectId: string, updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)))
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.freelancerAddress.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!connected) {
    return <WelcomePage />
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl rounded-full"
          />
          <h2 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Projects
          </h2>
        </div>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Manage your milestone-based projects and payments with ease
        </p>
      </motion.div>

      {/* Controls Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/60 backdrop-blur-sm border-white/20 focus:bg-white/80 transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-md"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-md"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Projects Section */}
      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center py-16 bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl rounded-full"
                    />
                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
                      <Briefcase className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>

                  <div>
                    <CardTitle className="text-2xl mb-3 text-slate-800">
                      {projects.length === 0 ? "No projects yet" : "No projects found"}
                    </CardTitle>
                    <CardDescription className="text-lg mb-8 max-w-md mx-auto">
                      {projects.length === 0
                        ? "Create your first project to start managing milestone payments"
                        : "Try adjusting your search terms"}
                    </CardDescription>
                  </div>

                  {projects.length === 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Project
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`grid gap-6 ${
              viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <ProjectCard
                  project={project}
                  onUpdate={(updatedProject) => updateProject(project.id, updatedProject)}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProject={addProject}
      />
    </motion.div>
  )
}
