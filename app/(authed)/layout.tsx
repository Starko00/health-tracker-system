import Providers from "@/utils/providers";

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
    </Providers>
  )
}