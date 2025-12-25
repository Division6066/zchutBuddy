export default function HomeBackground() {
  return (
    <>
      {/* Background gradient blobs - decorative only */}
      <div 
        className="absolute top-[-10%] right-[-10%] h-[40%] w-[60%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-[40%] left-[-20%] h-[50%] w-[70%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" 
        aria-hidden="true"
      />
    </>
  );
}

