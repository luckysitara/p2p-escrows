"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Shield, Clock, Users, Zap, ArrowRight } from "lucide-react"

export function WelcomePage() {
  const features = [
    {
      icon: Shield,
      title: "Secure Escrow",
      description: "Funds are held securely in smart contracts until milestones are completed",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "Milestone-Based",
      description: "Break projects into milestones and pay as work progresses",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "P2P Payments",
      description: "Direct payments between clients and freelancers without intermediaries",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Fast & Cheap",
      description: "Built on Solana for lightning-fast, low-cost transactions",
      color: "from-orange-500 to-red-500",
    },
  ]

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-12 max-w-6xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-full"
          />
          <motion.h1
            variants={itemVariants}
            className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight"
          >
            Welcome to
            <br />
            <span className="text-6xl md:text-8xl">Milestone Escrow</span>
          </motion.h1>
        </div>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
        >
          The most secure and elegant way to manage freelance projects with milestone-based payments on Solana
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col items-center space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"
            />
            <WalletMultiButton className="relative !bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !rounded-2xl !text-lg !px-12 !py-4 !font-semibold !shadow-2xl !transition-all !duration-300" />
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center space-x-2 text-slate-500">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Connect your wallet to get started</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        {[
          { label: "Secure Transactions", value: "100%", icon: Shield },
          { label: "Average Fee", value: "<$0.01", icon: Zap },
          { label: "Transaction Speed", value: "~400ms", icon: Clock },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
              <stat.icon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-slate-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div variants={containerVariants} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mx-auto mb-4 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-slate-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"
        />

        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and clients using secure milestone payments
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>Connect Wallet</span>
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
