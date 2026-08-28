'use client';

interface RakhiCardProps {
  senderName: string;
  message: string;
  designImage: string;
  designName: string;
  createdAt: string;
  onClick?: () => void;
  large?: boolean;
}

export default function RakhiCard({
  senderName,
  message,
  designImage,
  designName,
  createdAt,
  onClick,
  large = false,
}: RakhiCardProps) {
  const date = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className={`
        card cursor-pointer group
        ${large ? 'max-w-lg mx-auto' : ''}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Rakhi Image */}
      <div className={`
        mx-auto flex items-center justify-center mb-4
        ${large ? 'w-40 h-40' : 'w-24 h-24'}
      `}>
        <img
          src={designImage}
          alt={designName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Sender Name */}
      <h3 className={`
        font-display font-semibold text-maroon text-center mb-3
        ${large ? 'text-2xl' : 'text-lg'}
      `}>
        {senderName}
      </h3>

      {/* Message */}
      <p className={`
        text-charcoal-light text-center leading-relaxed mb-4 italic
        ${large ? 'text-base' : 'text-sm'}
      `}>
        &ldquo;{message}&rdquo;
      </p>

      {/* Decorative Separator */}
      <div className="decorative-border mb-3" />

      {/* Date */}
      <p className="text-xs text-charcoal-light/50 text-center">
        {date}
      </p>
    </div>
  );
}
