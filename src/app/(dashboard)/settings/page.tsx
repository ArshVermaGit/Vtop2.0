"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Shield, User, Palette, ChevronRight } from "lucide-react"

const settingsItems = [
  { icon: User, label: "Profile Settings", href: "/student/profile", desc: "Manage detailed personal information" },
  { icon: Shield, label: "Security & Privacy", href: "/settings/security", desc: "Password, 2FA, and sessions" },
  { icon: Bell, label: "Notifications", href: "/settings/preferences", desc: "Email and push notification preferences" },
  { icon: Palette, label: "Appearance", href: "/settings/preferences", desc: "Theme and display settings" },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and security.</p>
      </div>

      <div className="grid gap-4">
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={item.href}>
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
                <CardContent className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white group-hover:text-blue-200 transition-colors">{item.label}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
