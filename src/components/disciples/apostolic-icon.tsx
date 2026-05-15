import { LucideProps } from 'lucide-react';

interface ApostolicIconProps extends LucideProps {
  name: string;
}

export function ApostolicIcon({ name, ...props }: ApostolicIconProps) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('peter')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 13a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4z"/><path d="M12 10V8a2 2 0 0 0-2-2H9"/><path d="M14 10V8a2 2 0 0 1 2-2h1"/><circle cx="12" cy="12" r="10"/>
      </svg>
    );
  }

  if (normalizedName.includes('andrew')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 6L6 18M6 6l12 12"/><circle cx="12" cy="12" r="10"/>
      </svg>
    );
  }

  if (normalizedName.includes('james') && normalizedName.includes('zebedee')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3v18M3 12h18"/><path d="M12 8l-4 4 4 4"/><circle cx="12" cy="12" r="10"/>
      </svg>
    );
  }

  if (normalizedName.includes('john')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    );
  }

  if (normalizedName.includes('philip')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 2h10l1 7H6l1-7z"/><path d="M6 9v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"/><path d="M12 2v20M8 22h8"/><path d="M9 13a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
      </svg>
    );
  }

  if (normalizedName.includes('bartholomew')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14 3l-1 1-8 8a2 2 0 0 0 0 2.83l2.17 2.17a2 2 0 0 0 2.83 0l8-8 1-1V3h-5z"/><path d="M12 10l-2 2"/><path d="M18 6l-2 2"/>
      </svg>
    );
  }

  if (normalizedName.includes('thomas')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3v18M10 21h4"/><path d="M7 8h10v10l-3-3H7V8z"/><path d="M12 3l-2 3h4l-2-3z"/>
      </svg>
    );
  }

  if (normalizedName.includes('matthew')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V8z"/><path d="M9 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><circle cx="12" cy="9" r="1"/><path d="M12 13v4"/><path d="M8 17h8v3a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-3z"/>
      </svg>
    );
  }

  if (normalizedName.includes('james') && normalizedName.includes('alphaeus')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3v18"/><circle cx="12" cy="5" r="2"/><path d="M10 7h4v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7z"/><path d="M8 18h8"/>
      </svg>
    );
  }

  if (normalizedName.includes('jude') || normalizedName.includes('thaddaeus')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22V6M8 6h8l1-3H7l1 3z"/><path d="M12 6l-4 4h8l-4-4z"/>
      </svg>
    );
  }

  if (normalizedName.includes('simon')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 21l10-18"/><path d="M7 21l2-1M11 17l2-1M15 13l2-1M17 3l-2 1"/>
      </svg>
    );
  }

  if (normalizedName.includes('matthias')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22V8m0-5l-5 5h10l-5-5z"/><path d="M12 8l-6 2v4l6-2"/><path d="M12 22h-2m4 0h-2"/>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
    </svg>
  );
}
