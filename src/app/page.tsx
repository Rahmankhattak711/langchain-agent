"use client";
import { useEffect, useMemo, useState } from "react";

interface ChatBookRecommendation {
  title: string;
  author: string;
  description: string;
  link: string;
  image: string;
  rating: number;
  genre: string;
  tags: string[];
  summary: string;
  review: string;
  price: number;
  discount: number;
  discountPrice: number;
  discountLink: string;
  discountDescription: string;
}

export default function Book() {
  const [bookRecommendations, setBookRecommendations] = useState<
    ChatBookRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [onlyDeals, setOnlyDeals] = useState(false);

  useEffect(() => {
    const fetchBookRecommendations = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: "Recommend some books for me." }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBookRecommendations(data.bookRecommendations || []);
      } catch (error) {
        console.error("Error fetching book recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookRecommendations();
  }, []);

  const genres = useMemo(() => {
    const uniqueGenres = Array.from(
      new Set(bookRecommendations.map((book) => book.genre).filter(Boolean)),
    );

    return ["All", ...uniqueGenres];
  }, [bookRecommendations]);

  const filteredBooks = useMemo(() => {
    const matchedBooks = bookRecommendations.filter((book) => {
      const haystack =
        `${book.title} ${book.author} ${book.description} ${book.tags.join(" ")} ${book.genre}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      const matchesGenre = genre === "All" || book.genre === genre;
      const matchesDeal = !onlyDeals || book.discount > 0;

      return matchesQuery && matchesGenre && matchesDeal;
    });

    const sortedBooks = [...matchedBooks].sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "price") {
        return a.price - b.price;
      }

      if (sortBy === "discount") {
        return b.discount - a.discount;
      }

      return b.rating - a.rating;
    });

    return sortedBooks;
  }, [bookRecommendations, genre, onlyDeals, query, sortBy]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f5f7ff_0%,_#f8fafc_45%,_#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.4fr_0.8fr] lg:p-10">
            <div className="space-y-5">
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-700">
                Curated literary picks
              </span>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Discover your next favorite read.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Explore hand-picked recommendations with smarter filters,
                  curated summaries, and quick access to your next book.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">
                    Books
                  </span>
                  <span className="mt-1 block text-xl font-semibold text-slate-900">
                    {bookRecommendations.length}
                  </span>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <span className="block text-xs uppercase tracking-[0.25em]">
                    Deals
                  </span>
                  <span className="mt-1 block text-xl font-semibold">
                    {
                      bookRecommendations.filter((book) => book.discount > 0)
                        .length
                    }
                  </span>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <span className="block text-xs uppercase tracking-[0.25em]">
                    Top rated
                  </span>
                  <span className="mt-1 block text-xl font-semibold">4.8+</span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-inner">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Reading mode
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Focused, refined, and easy to browse.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Search by topic, narrow by genre, and sort the list to match
                your mood or your budget.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Why readers love it
                </p>
                <p className="mt-2 text-sm text-slate-100">
                  Clean cards, fast filters, and clear pricing make every
                  recommendation easier to act on.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.7fr_auto]">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try nonfiction, coding, habits..."
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition focus:border-indigo-400 focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>Genre</span>
              <select
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                {genres.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest rated</option>
                <option value="price">Lowest price</option>
                <option value="discount">Biggest discount</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={onlyDeals}
                onChange={(event) => setOnlyDeals(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Deals only
            </label>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
              />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <article
                key={`${book.title}-${index}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={
                      book.image ||
                      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60"
                    }
                    alt={book.title}
                    onError={handleImageError}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm">
                    {book.genre}
                  </div>
                  <div className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                    ★ {book.rating}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        {book.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        By {book.author}
                      </p>
                    </div>
                    {book.discount > 0 ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        -{book.discount}%
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {book.description}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {book.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {book.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={`${tag}-${tagIndex}`}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        {book.discount > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-semibold text-slate-900">
                              ${book.discountPrice}
                            </span>
                            <span className="text-sm text-slate-400 line-through">
                              ${book.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-semibold text-slate-900">
                            ${book.price}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={book.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </a>
                        <a
                          href={book.discountLink || book.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                          Buy
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">
              No matches yet
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Try adjusting the search or clearing a filter to see more
              recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
