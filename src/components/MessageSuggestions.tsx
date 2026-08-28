'use client';

interface MessageSuggestionsProps {
  onSelect: (message: string) => void;
}

const SUGGESTIONS = [
  'Happy Raksha Bandhan ❤️',
  'Miss you, bro!',
  'Wish I could tie this Rakhi myself.',
  'Always stay happy and safe ❤️',
  'No matter how far, you\'re always my brother.',
  'Love you always 🪢',
];

export default function MessageSuggestions({ onSelect }: MessageSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="
            text-xs px-4 py-2 rounded-full
            bg-cream-dark/60 text-charcoal-light
            hover:bg-maroon/10 hover:text-maroon
            transition-all duration-200 border border-transparent
            hover:border-maroon/20 cursor-pointer
          "
          type="button"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
