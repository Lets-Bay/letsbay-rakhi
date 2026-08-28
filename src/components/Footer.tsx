import Link from 'next/link';

interface FooterProps {
  showLetsbay?: boolean;
}

export default function Footer({ showLetsbay = true }: FooterProps) {
  return (
    <footer className="mt-auto py-8 px-4">
      <div className="decorative-border mb-8" />
      <div className="max-w-5xl mx-auto text-center">
        {showLetsbay && (
          <div className="mb-4">
            <p className="text-charcoal-light/60 text-sm">
              Made with ❤️ by{' '}
              <a
                href="https://letsbay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-maroon hover:text-maroon-light font-medium transition-colors"
              >
                Letsbay
              </a>
            </p>
          </div>
        )}
        <p className="text-charcoal-light/40 text-xs">
          © {new Date().getFullYear()} Digital Rakhi · A Letsbay Experience
        </p>
      </div>
    </footer>
  );
}
