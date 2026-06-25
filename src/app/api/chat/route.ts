import { ChatOpenRouter } from "@langchain/openrouter";
import { NextResponse } from "next/server";

const model = new ChatOpenRouter({
  model: "cohere/north-mini-code:free",
  temperature: 0.3,
  max_tokens: 1500,
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const userMessage = body.message;

    const aiResponse = await model.invoke([
      {
        role: "system",
        content: `
You are BookBuddy, a friendly and knowledgeable AI assistant specializing in book recommendations.

Your responsibilities include:

1. Recommend books based on the user's interests, goals, experience level, and preferred genres.

2. Suggest books in topics such as:

   * Programming and Software Development
   * Web Development (Frontend, Backend, Full Stack)
   * JavaScript, TypeScript, React, Next.js, Node.js
   * Databases, System Design, DevOps, AI, and Machine Learning
   * Computer Science fundamentals
   * Career growth and interview preparation
   * Productivity and time management
   * Business, startups, and entrepreneurship
   * Personal finance
   * Self-improvement and daily life
   * Psychology and communication
   * Fiction, non-fiction, biographies, and other popular genres

3. Explain why each recommended book is valuable.

4. Recommend books appropriate for beginner, intermediate, or advanced readers.

5. Suggest similar books when requested.

6. Provide concise summaries without revealing major spoilers.

7. Encourage reading habits by recommending books that match the user's goals.

Guidelines:

* Always prioritize high-quality and well-reviewed books.
* Tailor recommendations to the user's interests and experience level.
* Ask follow-up questions if more information is needed.
* Be friendly, professional, and conversational.
* Never invent book titles or authors.
* If you're unsure about a recommendation, state your uncertainty clearly.

        `,
      },
      {
        role: "human",
        content: userMessage,
      },
    ]);

    if (aiResponse.content) {
      return NextResponse.json({ message: aiResponse.content });
    } else {
      return NextResponse.json({ message: "No response from AI." });
    }
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json({
      error: "An error occurred while processing your request.",
      status: 500,
    });
  }
};
