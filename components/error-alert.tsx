import { AlertCircle, CheckCircle, InfoIcon, XCircle, X } from "lucide-react";
import { useEffect } from "react";

interface ErrorAlertProps {
  title?: string;
  message: string;
  variant?: "default" | "destructive" | "success" | "info";
  onClose?: () => void;
  autoCloseDuration?: number; // in milliseconds, default 4000ms
}

export function ErrorAlert({
  title,
  message,
  variant = "destructive",
  onClose,
  autoCloseDuration = 4000,
}: ErrorAlertProps) {
  // Auto-close alert after duration
  useEffect(() => {
    if (!onClose) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [onClose, autoCloseDuration]);
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "info":
        return <InfoIcon className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getColors = () => {
    switch (variant) {
      case "destructive":
        return {
          bg: "bg-red-500/[0.07]",
          border: "border-red-500/30",
          accent: "bg-red-500/20",
          text: "text-red-400",
          icon: "text-red-400",
        };
      case "success":
        return {
          bg: "bg-green-500/[0.07]",
          border: "border-green-500/30",
          accent: "bg-green-500/20",
          text: "text-green-400",
          icon: "text-green-400",
        };
      case "info":
        return {
          bg: "bg-blue-500/[0.07]",
          border: "border-blue-500/30",
          accent: "bg-blue-500/20",
          text: "text-blue-400",
          icon: "text-blue-400",
        };
      default:
        return {
          bg: "bg-[#c9a84c]/[0.07]",
          border: "border-[#c9a84c]/30",
          accent: "bg-[#c9a84c]/20",
          text: "text-[#c9a84c]",
          icon: "text-[#c9a84c]",
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`relative mb-4 ${colors.bg} border ${colors.border} overflow-hidden`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colors.accent}`} />

      <div className="p-4 pl-5 pr-10">
        <div className="flex items-start gap-3">
          <div className={colors.icon + " shrink-0 mt-0.5"}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <p
                className={`font-[Cinzel] font-semibold text-sm ${colors.text} mb-1`}
              >
                {title}
              </p>
            )}
            <p className="font-[Lato] text-sm text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`absolute right-3 top-3 ${colors.text} hover:opacity-80 transition-opacity p-1`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
