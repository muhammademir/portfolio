export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout ini tidak melakukan auth check — biarkan halaman login tampil bebas
  return <>{children}</>
}
