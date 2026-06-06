export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-4">Trending Hacker News API</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Get the top 10 trending stories from Hacker News in clean JSON format. Perfect for dashboards, bots, and tech apps.
      </p>
      <a 
        href="/api/trending" 
        target="_blank"
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
      >
        Test the API Endpoint
      </a>
    </main>
  );
}