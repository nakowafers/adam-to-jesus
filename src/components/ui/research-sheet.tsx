"use client";

import * as React from "react";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchSheetContextValue {
  onClose: () => void;
  isOpen: boolean;
}

const ResearchSheetContext = React.createContext<ResearchSheetContextValue | null>(null);

export function useResearchSheet() {
  const context = React.useContext(ResearchSheetContext);
  if (!context) {
    throw new Error("ResearchSheet subcomponents must be rendered inside ResearchSheet");
  }
  return context;
}

export interface ResearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
  backdropClassName?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

function ResearchSheetRoot({
  isOpen,
  onClose,
  children,
  className,
  backdropClassName,
  ariaLabelledBy,
  ariaDescribedBy,
}: ResearchSheetProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <ResearchSheetContext.Provider value={{ onClose, isOpen }}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              key="research-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className={cn(
                "fixed inset-0 z-40 bg-black/80 backdrop-blur-md",
                backdropClassName
              )}
              aria-hidden="true"
              data-testid="research-sheet-backdrop"
            />

            {/* Slide-Over Sheet Container */}
            <motion.div
              key="research-sheet-container"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-zinc-800 bg-black shadow-2xl",
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
              data-testid="research-sheet-container"
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ResearchSheetContext.Provider>
  );
}

export interface ResearchSheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function ResearchSheetHeader({
  children,
  className,
  showCloseButton = true,
  onClose: customOnClose,
  ...props
}: ResearchSheetHeaderProps) {
  const context = React.useContext(ResearchSheetContext);
  const handleClose = customOnClose || context?.onClose;

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-zinc-800 bg-black/95 px-6 py-4 backdrop-blur-sm md:py-6",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {showCloseButton && handleClose && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close details"
          className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          data-testid="research-sheet-close"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </header>
  );
}

export interface ResearchSheetBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function ResearchSheetBody({
  children,
  className,
  ...props
}: ResearchSheetBodyProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ResearchSheetFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function ResearchSheetFooter({
  children,
  className,
  ...props
}: ResearchSheetFooterProps) {
  return (
    <footer
      className={cn(
        "shrink-0 border-t border-zinc-800 bg-black p-4 md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </footer>
  );
}

export const ResearchSheet = Object.assign(ResearchSheetRoot, {
  Header: ResearchSheetHeader,
  Body: ResearchSheetBody,
  Footer: ResearchSheetFooter,
});
