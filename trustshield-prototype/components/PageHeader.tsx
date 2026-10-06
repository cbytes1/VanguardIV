interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon,
  action,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-navy-lighter/50 pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal">
            {icon}
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-white/60">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
