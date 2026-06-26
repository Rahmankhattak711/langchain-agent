export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-storm/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white font-black text-lg tracking-wider">
              G
            </div>
            <span className="text-xl font-bold tracking-tight text-navy">
              GAi<span className="font-medium text-storm">BookResearcher</span>
            </span>
          </div>
        </div>
      </nav>
  )
}
