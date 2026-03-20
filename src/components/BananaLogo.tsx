const BananaLogo = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9 sm:w-10 sm:h-10";

  return (
    <div className={`${dim} bg-[#1a1a2e] border border-gray-700 rounded-xl flex items-center justify-center`}>
      <span className={size === "sm" ? "text-base" : "text-lg sm:text-xl"} role="img" aria-label="Bananaverse logo">🍌</span>
    </div>
  );
};

export default BananaLogo;
