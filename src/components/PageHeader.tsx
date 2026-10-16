import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  breadcrumbs: { label: string; page?: string }[];
  onNavigate: (page: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  breadcrumbs,
  onNavigate,
}) => {
  return (
    <div className="bg-[#002868] text-white py-8 md:py-10 border-b border-[#001e50] relative overflow-hidden">
      {/* Subtle geometric pattern accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-white/75 flex-wrap">
            <button
              onClick={() => onNavigate('beranda')}
              className="flex items-center gap-1 hover:text-[#FFB800] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-white/40" />
              {crumb.page ? (
                <button
                  onClick={() => onNavigate(crumb.page!)}
                  className="hover:text-[#FFB800] transition-colors cursor-pointer"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

        {/* Title & Badge */}
        <div className="max-w-3xl">
          {badge && (
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#FFB800] text-xs font-semibold mb-3 border border-white/15">
              {badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-heading leading-tight mb-2">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl font-normal">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
