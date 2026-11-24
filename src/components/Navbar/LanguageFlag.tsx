import { useId } from 'react';
import type { Language } from '../../i18n';

type LanguageFlagProps = {
  language: Language;
  className?: string;
};

export function LanguageFlag({ language, className }: LanguageFlagProps) {
  const clipId = useId();

  if (language === 'pt-BR') {
    return (
      <svg
        className={className}
        width="20"
        height="14"
        viewBox="0 0 20 14"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <rect width="20" height="14" rx="2" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="20" height="14" fill="#009b3a" />
          <polygon points="10,1.6 18.2,7 10,12.4 1.8,7" fill="#fedf00" />
          <circle cx="10" cy="7" r="3.2" fill="#002776" />
          <path
            d="M7.1 6.6c1.9-.6 4-.3 5.8.7"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width="20"
      height="14"
      viewBox="0 0 20 14"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="20" height="14" rx="2" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="20" height="14" fill="#ffffff" />
        <rect y="0" width="20" height="1.08" fill="#b22234" />
        <rect y="2.15" width="20" height="1.08" fill="#b22234" />
        <rect y="4.3" width="20" height="1.08" fill="#b22234" />
        <rect y="6.46" width="20" height="1.08" fill="#b22234" />
        <rect y="8.62" width="20" height="1.08" fill="#b22234" />
        <rect y="10.77" width="20" height="1.08" fill="#b22234" />
        <rect y="12.92" width="20" height="1.08" fill="#b22234" />
        <rect width="8.5" height="7.54" fill="#3c3b6e" />
        <circle cx="2" cy="1.8" r="0.45" fill="#ffffff" />
        <circle cx="4.25" cy="1.8" r="0.45" fill="#ffffff" />
        <circle cx="6.5" cy="1.8" r="0.45" fill="#ffffff" />
        <circle cx="3.1" cy="3.75" r="0.45" fill="#ffffff" />
        <circle cx="5.4" cy="3.75" r="0.45" fill="#ffffff" />
        <circle cx="2" cy="5.7" r="0.45" fill="#ffffff" />
        <circle cx="4.25" cy="5.7" r="0.45" fill="#ffffff" />
        <circle cx="6.5" cy="5.7" r="0.45" fill="#ffffff" />
      </g>
    </svg>
  );
}
