"use client";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

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

  const { genres, totalDeals } = useMemo(() => {
    const uniqueGenres = Array.from(
      new Set(bookRecommendations.map((book) => book.genre).filter(Boolean)),
    );
    const dealCount = bookRecommendations.filter(
      (book) => book.discount > 0,
    ).length;

    return {
      genres: ["All", ...uniqueGenres],
      totalDeals: dealCount,
    };
  }, [bookRecommendations]);

  const filteredBooks = useMemo(() => {
    const matchedBooks = bookRecommendations.filter((book) => {
      const safeTags = book.tags ?? [];
      const haystack =
        `${book.title} ${book.author} ${book.description} ${safeTags.join(" ")} ${book.genre}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      const matchesGenre = genre === "All" || book.genre === genre;
      const matchesDeal = !onlyDeals || book.discount > 0;

      return matchesQuery && matchesGenre && matchesDeal;
    });

    return [...matchedBooks].sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "price") {
        const effectivePriceA = a.discount > 0 ? a.discountPrice : a.price;
        const effectivePriceB = b.discount > 0 ? b.discountPrice : b.price;
        return effectivePriceA - effectivePriceB;
      }
      if (sortBy === "discount") {
        return b.discount - a.discount;
      }
      return b.rating - a.rating;
    });
  }, [bookRecommendations, genre, onlyDeals, query, sortBy]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Fixed/Sticky Navigation Bar */}
      <Navbar />

      {/* Main Container Layout */}
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Left Control Sidebar (Sticky below navigation bar on desktop) */}

        <SideBar
          query={query}
          setQuery={setQuery}
          genre={genre}
          genres={genres}
          setGenre={setGenre}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onlyDeals={onlyDeals}
          setOnlyDeals={setOnlyDeals}
          bookRecommendations={bookRecommendations}
          totalDeals={totalDeals}
        />

        {/* Right Main Grid Workspace */}
        <main className="flex-1">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-[1.5rem] border border-storm/10 bg-white"
                />
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book, index) => (
                <article
                  key={`${book.title}-${index}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-storm/20 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Book Banner */}
                  <div className="relative h-48 shrink-0 overflow-hidden bg-background">
                    <img
                      src={
                        book.image ||
                        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60"
                      }
                      alt={book.title}
                      onError={handleImageError}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 border border-storm/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy shadow-sm">
                      {book.genre}
                    </div>
                    <div className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-navy shadow-sm">
                      ★ {book.rating}
                    </div>
                  </div>

                  {/* Card Content Segment */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold text-navy tracking-tight line-clamp-1">
                          {book.title}
                        </h2>
                        <p className="text-xs text-storm mt-0.5">
                          By {book.author}
                        </p>
                      </div>
                      {book.discount > 0 && (
                        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-navy border border-gold/30 shrink-0">
                          -{book.discount}%
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-navy/80 line-clamp-3">
                      {book.description}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-storm italic border-l border-gold/60 pl-2 line-clamp-2">
                      {book.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(book.tags ?? []).slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={`${tag}-${tagIndex}`}
                          className="rounded-md bg-background border border-storm/10 px-2 py-0.5 text-[10px] text-storm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Lower Checkout Row */}
                    <div className="mt-5 border-t border-storm/10 pt-3 mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          {book.discount > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-base font-bold text-navy">
                                ${book.discountPrice}
                              </span>
                              <span className="text-xs text-storm line-through">
                                ${book.price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-base font-bold text-navy">
                              ${book.price}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <a
                            href={book.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-storm/30 px-3 py-1.5 text-xs font-medium text-navy transition hover:bg-background"
                          >
                            View
                          </a>
                          <a
                            href={book.discountLink || book.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white transition hover:bg-storm"
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
            <div className="rounded-[1.5rem] border border-dashed border-storm/30 bg-white p-12 text-center">
              <p className="text-base font-semibold text-navy">
                No books fit this criteria
              </p>
              <p className="mt-1 text-xs text-storm">
                Try updating your filters inside the sidebar layout
                configuration.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
