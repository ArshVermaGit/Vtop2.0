"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, RefreshCw, Activity, AlertTriangle, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearDatabase, seedDatabase } from "@/lib/admin-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function DatabaseControlClient({ counts }: { counts: Record<string, number> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  const handleClear = async () => {
    setIsLoading(true)
    try {
      await clearDatabase()
      toast.success("Database cleared successfully!")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to clear database")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      await seedDatabase()
      toast.success("Database seeded with sample data!")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to seed database")
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(counts).map(([key, value]) => (
            <Card key={key} className="bg-white/5 border-white/10 p-4 hover:bg-white/[0.07] transition-colors group">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest truncate">{key}</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xl font-black text-white">{value}</p>
                    <Activity className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-rose-500/5 border-rose-500/20 text-white shadow-2xl shadow-rose-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-rose-400 flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5" /> Danger Zone
              </CardTitle>
              <Badge variant="outline" className="border-rose-500/30 text-rose-500 text-[10px] px-2 py-0 font-black uppercase">Critical</Badge>
            </div>
            <CardDescription className="text-rose-400/60 font-medium">Atomic actions that modify entire table structures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20" disabled={isLoading || isSeeding}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Purge Entire Database
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black text-rose-500">ABSOLUTE PURGE REQUESTED</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      This action will <strong>PERMANENTLY DELETE</strong> every record from all models including Users, Students, Courses, and Audits. This cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                      <Button variant="outline" className="border-white/10 text-gray-400">Cancel</Button>
                      <Button variant="destructive" onClick={handleClear} disabled={isLoading}>
                          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                          Execute Purge
                      </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <p className="text-[10px] text-rose-400/40 text-center uppercase font-black tracking-tighter">Use with extreme caution • Logs will be generated</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/20 text-white shadow-2xl shadow-emerald-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                 <Database className="w-5 h-5" /> Maintenance
              </CardTitle>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] px-2 py-0 font-black uppercase">Active</Badge>
            </div>
            <CardDescription className="text-emerald-400/60 font-medium">System restoration and data integrity tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 shadow-lg shadow-emerald-600/5"
                  onClick={handleSeed}
                  disabled={isLoading || isSeeding}
              >
                 {isSeeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />} 
                 Sync Seed Engine
              </Button>
              <p className="text-[10px] text-emerald-400/40 text-center uppercase font-black tracking-tighter">Fills database with core schemas and samples</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
