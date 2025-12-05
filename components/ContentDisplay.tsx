// components/ContentDisplay.tsx

import { getRandomContent } from '@/lib/contentService'; // Uses the function we wrote earlier

export default async function ContentDisplay() {
  // Fetching happens directly in this Server Component
  const content = await getRandomContent();

  if (!content) {
    // Return null if no active content is found in the database
    return null; 
  }

  // Determine if it's a clickable banner or a static verse
  const isBanner = content.target_url && content.content_type === 'Banner Ad';

  return (
    <div className="daily-verse-container p-6 bg-gray-50 border-t border-b border-gray-200 shadow-inner">
      <h2 className="text-lg font-serif font-bold text-center mb-2 text-blue-900">
        {content.content_type === 'Bible Verse' ? 'Today\'s Inspiration' : content.content_type}
      </h2>
      
      {/* The main content body */}
      <blockquote className="text-2xl italic text-center text-gray-700 leading-relaxed">
        "{content.body}"
      </blockquote>
      
      {/* Display Reference for Verses/Quotes */}
      {content.reference && !isBanner && (
        <p className="text-sm text-center mt-3 font-semibold text-blue-700">
          — {content.reference}
        </p>
      )}

      {/* Display Link for Banner Ads */}
      {isBanner && (
        <div className="text-center mt-4">
            <a 
                href={content.target_url!} 
                className="text-white bg-green-600 hover:bg-green-700 font-bold py-2 px-6 rounded-full transition duration-300 shadow-md"
                target="_blank" 
                rel="noopener noreferrer"
            >
                {/* The body text is the call-to-action */}
                {content.body} (Click Here!)
            </a>
        </div>
      )}
    </div>
  );
}