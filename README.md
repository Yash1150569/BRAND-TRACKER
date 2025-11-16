# BRAND-TRACKER
# BrandPulse - Real-time AI-Powered Brand Reputation Tracking

BrandPulse is a modern, responsive web application that provides real-time tracking of brand mentions across various online platforms. It leverages the power of Genkit and Google's Gemini models to analyze sentiment, cluster discussions into topics, and generate insightful reports, giving businesses a live pulse of their brand's public reputation.


## Key Features

*   **Real-time Mention Feed**: Simulates a live feed of brand mentions from sources like Twitter, news sites, blogs, and forums to provide up-to-the-minute insights.
*   **AI-Powered Sentiment Analysis**: Each mention is automatically analyzed by a Genkit AI flow to determine if the sentiment is positive, negative, or neutral, complete with a confidence score.
*   **AI-Driven Topic Clustering**: Mentions are intelligently grouped into key discussion themes, allowing users to quickly identify what aspects of their brand people are talking about.
*   **On-Demand AI Reporting**: Users can generate summary reports for different time periods, providing a high-level overview of brand performance, sentiment trends, and key topics.
*   **Interactive Dashboard**: All data is presented in a clean, interactive dashboard featuring statistical cards, a sentiment-over-time chart, and a collapsible list of topic clusters.
*   **Responsive & Modern UI**: Built with ShadCN UI and Tailwind CSS, the application is fully responsive and works seamlessly on devices of all sizes, offering a polished and modern user experience.

## Tech Stack & Architectural Decisions

This project is built with a modern, robust, and scalable tech stack, with each component chosen for specific reasons:

*   **Framework**: **[Next.js (App Router)](https://nextjs.org/)** was chosen for its robust feature set, including Server Components and Server Actions, which are central to the application's architecture. This allows for efficient data fetching and server-side logic, reducing client-side load and improving performance.
*   **Language**: **[TypeScript](https://www.typescriptlang.org/)** is used throughout the project to ensure type safety, improve code quality, and enhance developer productivity, especially in a project with complex data structures.
*   **AI Integration**: **[Genkit](https://firebase.google.com/docs/genkit)** is used as the backbone for all AI-powered features. It provides a structured way to define, run, and manage AI flows, making it easy to integrate with Google's Gemini models for sentiment analysis, topic clustering, and report generation.
*   **Styling**: **[Tailwind CSS](https://tailwindcss.com/)** is used for its utility-first approach, enabling rapid and consistent UI development without leaving the HTML.
*   **UI Components**: **[ShadCN UI](https://ui.shadcn.com/)** provides a set of beautifully designed, accessible, and unopinionated components that can be easily customized. This accelerates development while maintaining a high-quality look and feel.
*   **Icons**: **[Lucide React](https://lucide.dev/)** offers a comprehensive and lightweight set of icons that integrate seamlessly into the project.
*   **Charts**: **[Recharts](https://recharts.org/)** is used for its declarative and composable charting components, making it straightforward to build the interactive "Sentiment Over Time" chart.

## Technical Approach & Key Decisions

The application is architected around a few core principles: server-centric logic, real-time simulation, and modular AI flows.

### 1. Server-Centric Architecture with Next.js App Router

The application heavily utilizes Next.js Server Components and Server Actions.

*   **Initial Data Load**: On the initial page load, the main `page.tsx` component is a Server Component. It fetches the mock data and performs the initial AI analysis (sentiment and topic clustering) on the server using Server Actions (`getSentimentForMentions`, `getTopicsForMentions`). This ensures the user receives a fully rendered page with initial data, improving perceived performance.
*   **Client-Side Interactivity**: Components requiring user interaction (e.g., `ReportDialog`, `TopicClusters` refresh) are marked with `'use client'`. They call Server Actions to trigger server-side logic (like generating a report) without needing to create separate API endpoints. This simplifies the architecture and keeps business logic on the server.

### 2. Real-time Simulation

To showcase the real-time nature of brand tracking, the `RecentMentions` component simulates a live feed.

*   A `useEffect` hook with a `setInterval` function adds a new, randomly generated mention to the state every 15 seconds. This happens entirely on the client-side to create a dynamic experience without constant server polling.

### 3. Modular AI Flows with Genkit

All AI functionality is encapsulated in Genkit flows, located in the `src/ai/flows` directory. This modular approach has several benefits:

*   **Separation of Concerns**: AI logic is kept separate from the UI and server action logic, making it easier to maintain and test.
*   **Structured Prompts**: Each flow uses `ai.defineFlow` and `ai.generate` to interact with the Gemini models. Prompts are carefully crafted to request structured JSON output by providing a Zod schema. This is a key decision to ensure the AI's response is predictable and reliable, preventing the kind of errors that can occur with unstructured text responses.
*   **Error Handling**: The server actions that call these flows include `try...catch` blocks to gracefully handle potential failures in the AI analysis, returning fallback data to prevent the UI from crashing.

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or a compatible package manager
*   A Google AI API Key for Genkit functionality.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your Google AI API Key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```
    You can obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This command starts the Next.js application in development mode with Turbopack for faster performance.

2.  Open your browser and navigate to [http://localhost:9002](http://localhost:9002) to see the application.

## Available Scripts

*   `npm run dev`: Starts the development server on port 9002.
*   `npm run build`: Creates a production-ready build of the application.
*   `npm run start`: Starts the application in production mode (requires a build first).
*   `npm run lint`: Lints the codebase for potential errors and style issues using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs the TypeScript compiler to check for type errors without generating a build.
