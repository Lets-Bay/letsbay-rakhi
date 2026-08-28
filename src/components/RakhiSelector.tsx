'use client';

interface RakhiDesign {
  id: string;
  name: string;
  imageUrl: string;
  description: string | null;
}

interface RakhiSelectorProps {
  designs: RakhiDesign[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function RakhiSelector({ designs, selectedId, onSelect }: RakhiSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {designs.map((design) => (
        <button
          key={design.id}
          onClick={() => onSelect(design.id)}
          className={`
            relative rounded-2xl p-4 transition-all duration-300 cursor-pointer
            border-2 bg-white
            flex flex-col items-center gap-2
            hover:shadow-lg hover:-translate-y-1
            ${
              selectedId === design.id
                ? 'border-maroon shadow-lg shadow-maroon/15 scale-[1.02]'
                : 'border-cream-dark hover:border-gold'
            }
          `}
          aria-label={`Select ${design.name} Rakhi`}
        >
          {selectedId === design.id && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-maroon rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
          <div className="w-full aspect-square flex items-center justify-center p-2">
            <img
              src={design.imageUrl}
              alt={design.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <p className="text-xs font-medium text-charcoal text-center leading-tight">
            {design.name}
          </p>
        </button>
      ))}
    </div>
  );
}
