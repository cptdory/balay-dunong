import { AlertCircle, CheckCircle, InfoIcon, XCircle, XIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ErrorAlertProps {
  title?: string;
  message: string;
  variant?: "default" | "destructive" | "success" | "info";
  onClose?: () => void;
}

export function ErrorAlert({
  title = "Error",
  message,
  variant = "destructive",
  onClose,
}: ErrorAlertProps) {
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "info":
        return <InfoIcon className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const alertVariant = variant === "success" || variant === "info" ? "default" : variant;

  return (
    <Alert variant={alertVariant as any} className="mb-4">
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-sm underline"
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </Alert>
  );
}
