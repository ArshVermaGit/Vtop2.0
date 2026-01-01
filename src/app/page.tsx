import { LoginBox } from "@/components/LoginBox";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black selection:bg-blue-500/30">
        
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[100px]" />
        
         {/* Grid Pattern */}
         <div className="absolute inset-0 bg-size-[24px_24px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 p-4 w-full flex flex-col items-center gap-8">
        <LoginBox />
      </div>
    </main>
  );
}
