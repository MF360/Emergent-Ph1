const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
        <div className="h-4 w-4 rounded-sm bg-primary-foreground"></div>
      </div>
      <span className="text-lg font-semibold text-foreground tracking-tight">
        MF360
      </span>
    </div>
  );
};

export default Logo;
