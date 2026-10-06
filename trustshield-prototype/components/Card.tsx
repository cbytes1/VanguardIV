import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-navy-lighter/50 bg-navy-light/60 p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
