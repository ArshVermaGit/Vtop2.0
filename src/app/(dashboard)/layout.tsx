export const dynamic = 'force-dynamic'
import { Sidebar } from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
         {/* Background Ambient Mesh */}
         <div className="fixed inset-0 pointer-events-none z-0">
             <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]" />
             <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px]" />
         </div>
         
        <div className="relative z-10 p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  )
}
