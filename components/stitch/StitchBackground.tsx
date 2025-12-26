/**
 * Decorative background gradient blobs for Stitch pages
 */
export default function StitchBackground() {
  return (
    <>
      <div
        className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
