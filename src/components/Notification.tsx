import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

interface NotificationProps {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />,
    info: <AlertCircle className="text-blue-500" size={24} />,
  };

  const colors = {
    success: "border-green-500/20 bg-green-500/10",
    error: "border-red-500/20 bg-red-500/10",
    info: "border-blue-500/20 bg-blue-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed bottom-8 right-8 z-50 glass rounded-2xl border ${colors[type]} backdrop-blur-xl p-4 min-w-[320px] shadow-2xl`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">{icons[type]}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-text-silver/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
}