export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
