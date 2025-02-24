import Image from "next/image";
import AuthButton from "@/components/AuthButton";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <div className="flex flex-col items-center justify-center">
    <div className="mt-10">
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdqDrXafqmYEztKVcjrYlGWsJE4Y7ugJCamlJtA9kUXTeYDHg/viewform?embedded=true" width="640" height="722" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
    </div>
      <AuthButton />
      </div>
      </div>
  );
}
