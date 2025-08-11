import { useEffect, useRef } from 'react';

interface TooltipProps {
  html: string;
  children: React.ReactNode;
  className?: string;
  offset?: number; // distance from trigger to tooltip
}

export default function Tooltip({ html, children, className = '', offset = 10 }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipElementRef = useRef<HTMLDivElement | null>(null);

  const showTooltip = (e: React.MouseEvent) => {
    const existingTooltip = document.querySelector('.tooltip') as HTMLDivElement | null;
    if (existingTooltip) existingTooltip.remove();

    const tooltip = document.createElement('div');
    tooltip.className = `fixed px-3 py-2 bg-slate-900 text-xs text-white rounded-md z-50 tooltip border border-slate-600 shadow-lg ${className}`;
    tooltip.innerHTML = html;
    tooltip.style.maxWidth = '220px';
    tooltip.style.whiteSpace = 'pre-wrap';
    tooltip.style.wordBreak = 'break-word';

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - offset}px`;
    tooltip.style.transform = 'translateX(-50%) translateY(-100%)';

    document.body.appendChild(tooltip);
    tooltipElementRef.current = tooltip;
  };

  const hideTooltip = () => {
    if (tooltipElementRef.current) {
      tooltipElementRef.current.remove();
      tooltipElementRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (tooltipElementRef.current) {
        tooltipElementRef.current.remove();
      }
    };
  }, []);

  return (
    <div ref={tooltipRef} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} className="cursor-pointer">
      {children}
    </div>
  );
}
