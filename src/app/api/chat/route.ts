import { ChatOpenRouter } from "@langchain/openrouter";
import { NextResponse } from "next/server";

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

const promptMessage = `
You are BookBuddy, an AI assistant that recommends books for any topic.

Your job is to recommend the best books based on the user's request.

You should recommend books that are relevant to the user's topic.

You can recommend books about:

• Science Fiction
  - Fantasy
  - Horror
  - Thriller
  - Mystery
  - Romance

• Non-Fiction
  - Biography
  - Autobiography
  - History
  - Philosophy
  - Religion

• Children's Books
  - Comics
  - Manga
  - Children's Literature

• Literature
  - Fiction
  - Poetry
  - Drama

• Programming
  - JavaScript
  - TypeScript
  - Python
  - Java
  - C#
  - C++
  - Go
  - Rust
  - PHP
  - Kotlin
  - Swift

• Web Development
  - HTML
  - CSS
  - React
  - Next.js
  - Angular
  - Vue
  - Node.js
  - Express
  - NestJS

• Mobile Development
  - Flutter
  - React Native
  - Android
  - iOS

• Databases
  - SQL
  - PostgreSQL
  - MySQL
  - MongoDB
  - Redis

• DevOps
  - Docker
  - Kubernetes
  - AWS
  - Azure
  - Google Cloud
  - CI/CD

• AI & Machine Learning
  - Artificial Intelligence
  - Machine Learning
  - Deep Learning
  - Data Science
  - LLMs
  - Prompt Engineering

• Cyber Security

• Computer Science

• Algorithms

• Data Structures

• System Design

• Software Engineering

• Career & Interview Preparation

• Productivity

• Business

• Startups

• Entrepreneurship

• Leadership

• Communication

• Psychology

• Personal Finance

• Investing

• Marketing

• Sales

• Self Improvement

• Health & Fitness

• Nutrition

• Daily Life

• Habits

• Relationships

• History

• Science

• Mathematics

• Philosophy

• Religion

• Fiction

• Fantasy

• Mystery

• Horror

• Romance

• Thriller

• Biography

• Autobiography

• Children's Books

• Comics

• Manga

• And any other book category requested by the user.

Rules:

1. Recommend only real books.
2. Never invent books or authors.
3. Recommend 1–100 books depending on the user's request.
4. Tailor recommendations to the user's experience level.
5. Include a concise summary and why the book is worth reading.
6. If the user asks for similar books, recommend similar titles.
7. If no suitable books exist, return an empty array.

IMPORTANT:

Return ONLY valid JSON.

Do NOT write explanations.

Do NOT write markdown.

Do NOT write \`\`\`.

Do NOT write "Sure".

Return ONLY this JSON array:

[
  {
    "title": "",
    "author": "",
    "description": "",
    "link": "",
    "image": "",
    "rating": ${Math.floor(Math.random() * 5) + 0.1},
    "genre": "",
    "tags": [],
    "summary": "",
    "review": "",
    "price": 0,
    "discount": 0,
    "discountPrice": 0,
    "discountLink": "",
    "discountDescription": ""
  }
]

`;

const fallbackRecommendations: ChatBookRecommendation[] = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "A practical guide to building better habits and breaking bad ones.",
    link: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
    image: "",
    rating: 4.9,
    genre: "Self Improvement",
    tags: ["habits", "productivity", "psychology"],
    summary: "A simple framework for making meaningful changes that stick.",
    review: "Highly actionable and easy to apply in daily life.",
    price: 18,
    discount: 0,
    discountPrice: 18,
    discountLink: "",
    discountDescription: "",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    description:
      "A compelling argument for focused work in a distracted world.",
    link: "https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692",
    image: "",
    rating: 4.7,
    genre: "Productivity",
    tags: ["focus", "career", "discipline"],
    summary:
      "Shows why sustained concentration is a superpower in modern work.",
    review: "A great read for anyone who wants better attention and output.",
    price: 16,
    discount: 0,
    discountPrice: 16,
    discountLink: "",
    discountDescription: "",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt and David Thomas",
    description: "A timeless guide to building software that lasts.",
    link: "https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052",
    image: "",
    rating: 4.8,
    genre: "Programming",
    tags: ["software engineering", "development", "career"],
    summary:
      "Covers practical habits and techniques every developer should know.",
    review:
      "Still relevant years after publication because of its core principles.",
    price: 39,
    discount: 0,
    discountPrice: 39,
    discountLink: "",
    discountDescription: "",
  },
];

const createChatModel = () =>
  new ChatOpenRouter({
    model: "cohere/north-mini-code:free",
    temperature: 0.9,
    maxTokens: 5000,
    apiKey: process.env.OPENROUTER_API_KEY,
  });

const parseChatResponse = (response: string): ChatBookRecommendation[] => {
  try {
    const parsedResponse = JSON.parse(response) as ChatBookRecommendation[];
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing chat response:", error);
    return [];
  }
};

export const POST = async (req: Request) => {
  try {
    const body = (await req.json().catch(() => ({}))) as { message?: string };
    const userMessage =
      typeof body.message === "string"
        ? body.message
        : "Recommend some books for me.";

    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        bookRecommendations: fallbackRecommendations,
        source: "fallback",
      });
    }

    const chatModel = createChatModel();
    const aiResponse = await chatModel.invoke([
      {
        role: "system",
        content: promptMessage,
      },
      {
        role: "human",
        content: userMessage,
      },
    ]);

    const aiResponseText = aiResponse.text;
    const parsedRecommendations = parseChatResponse(aiResponseText);
    const bookRecommendations =
      parsedRecommendations.length > 0
        ? parsedRecommendations
        : fallbackRecommendations;

    return NextResponse.json({ bookRecommendations, source: "ai" });
  } catch (error) {
    console.error("Error generating book recommendations:", error);

    return NextResponse.json({
      bookRecommendations: fallbackRecommendations,
      source: "fallback",
    });
  }
};
