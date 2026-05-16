import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface GravatarAvatarProps {
  email?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function GravatarAvatar({
  email,
  name,
  size = "md",
  className,
}: GravatarAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0]?.[0]?.toUpperCase() || "?";
  }, [name]);

  const getGravatarUrl = (emailAddress: string, sizeInPx: number) => {
    const trimmed = emailAddress.trim().toLowerCase();
    const md5Hash = simpleHash(trimmed);
    return `https://www.gravatar.com/avatar/${md5Hash}?s=${sizeInPx}&d=identicon`;
  };

  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const sizeInPx = {
    sm: 32,
    md: 40,
    lg: 64,
  };

  const gravatarUrl = email ? getGravatarUrl(email, sizeInPx[size]) : null;

  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-cyan-500",
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={cn(
        sizeClasses[size],
        "rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white text-sm overflow-hidden",
        className
      )}
    >
      {gravatarUrl ? (
        <img
          src={gravatarUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => {}}
        />
      ) : (
        <div className={cn(bgColor, "h-full w-full flex items-center justify-center")}>
          {initials}
        </div>
      )}
    </div>
  );
}
