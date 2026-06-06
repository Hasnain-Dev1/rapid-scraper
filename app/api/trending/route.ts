import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

let cachedData: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 mins cache

export async function GET(request: Request) {
  // Return Cache
  if (cachedData.length > 0 && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    return NextResponse.json({ status: 'success', source: 'cache', count: cachedData.length, data: cachedData });
  }

  try {
    // Scrape Hacker News
    const { data } = await axios.get('https://news.ycombinator.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(data);
    const stories: any[] = [];

    $('tr.athing').each((index, element) => {
      if (index >= 10) return false; // Get top 10 stories

      const titleElement = $(element).find('.titleline > a');
      const title = titleElement.text().trim();
      const url = titleElement.attr('href');
      
      const subtext = $(element).next('tr').find('.subtext');
      const points = subtext.find('.score').text().replace(' points', '').trim();
      const author = subtext.find('.hnuser').text().trim();

      if (title) {
        stories.push({
          rank: index + 1,
          title,
          url: url || 'No URL',
          points: points || '0',
          author: author || 'Unknown'
        });
      }
    });

    // Update Cache
    cachedData = stories;
    lastFetchTime = Date.now();

    return NextResponse.json({ status: 'success', source: 'live', count: stories.length, data: stories });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to scrape Hacker News.' }, { status: 503 });
  }
}