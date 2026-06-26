"use client";

interface SideBarProps {
  genre: string;
  genres: string[];
  setGenre: (genre: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  onlyDeals: boolean;
  setOnlyDeals: (checked: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  bookRecommendations: any[]; // Replace 'any' with ChatBookRecommendation[] if available globally
  totalDeals: number;
}

export default function SideBar({
  genre,
  genres,
  setGenre,
  sortBy,
  setSortBy,
  onlyDeals,
  setOnlyDeals,
  query,
  setQuery,
  bookRecommendations,
  totalDeals,
}: SideBarProps) {
  return (
    <aside className="w-full lg:w-80 lg:sticky lg:top-24 shrink-0 flex flex-col gap-6 h-fit">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-storm/30 bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-navy">
          Curated Picks
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-navy">
          Discover Reads.
        </h1>
        <p className="text-sm text-storm leading-relaxed">
          Explore hand-picked recommendations with intuitive controls.
        </p>
      </div>

      {/* Filter Panel Card */}
      <div className="rounded-2xl border border-storm/20 bg-white p-5 shadow-sm space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
          Filter Options
        </h3>

        <div className="space-y-4">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-navy">
            <span>Search Title / Tags</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try coding, habits, prose..."
              className="rounded-xl border border-storm/20 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-navy focus:bg-white"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-navy">
            <span>Genre Selection</span>
            <select
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              className="rounded-xl border border-storm/20 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-navy focus:bg-white"
            >
              {genres.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-navy">
            <span>Sort Metrics</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-xl border border-storm/20 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-navy focus:bg-white"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest rated</option>
              <option value="price">Lowest price</option>
              <option value="discount">Biggest discount</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-storm/20 bg-background px-3 py-2.5 text-sm font-medium text-navy cursor-pointer hover:bg-storm/5 transition">
            <input
              type="checkbox"
              checked={onlyDeals}
              onChange={(event) => setOnlyDeals(event.target.checked)}
              className="h-4 w-4 rounded border-storm text-navy focus:ring-navy"
            />
            Deals only
          </label>
        </div>
      </div>

      {/* Quick Statistics Block */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-storm/20 bg-white p-3 text-center">
          <span className="block text-[10px] uppercase tracking-wider text-storm">
            Books
          </span>
          <span className="text-lg font-bold text-navy">
            {bookRecommendations.length}
          </span>
        </div>
        <div className="rounded-xl border border-gold/40 bg-gold/10 p-3 text-center">
          <span className="block text-[10px] uppercase tracking-wider text-navy">
            Deals Available
          </span>
          <span className="text-lg font-bold text-navy">{totalDeals}</span>
        </div>
      </div>
    </aside>
  );
}
