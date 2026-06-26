"use client";
import { useEffect, useState } from "react";

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
  const [bookRecommendations, setBookRecommendations] = useState<ChatBookRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

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

   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Your Book Recommendations
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Handpicked literary choices just for you.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : bookRecommendations.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bookRecommendations.map((book, index) => (
              <div
                key={index}
                className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Book Cover Container */}
                <div className="relative h-64 bg-gray-200 overflow-hidden group">
                  <img
                    src={book.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60"}
                    alt={book.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {book.genre}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {book.title}
                      </h2>
                      <div className="flex items-center text-amber-500 text-sm font-medium shrink-0">
                        ★ <span className="ml-1 text-gray-700">{book.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-indigo-600">By {book.author}</p>
                    <p className="text-sm text-gray-500 line-clamp-3">{book.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {book.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        {book.discount > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">${book.discountPrice}</span>
                            <span className="text-sm text-gray-400 line-through">${book.price}</span>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                              {book.discount}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">${book.price}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        View Book
                      </a>
                      <a
                        href={book.discountLink || book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                      >
                        Buy Deal
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-lg text-gray-500">No book recommendations available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
