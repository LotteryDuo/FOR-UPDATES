import React from "react";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const alertStyles = {
  success: "bg-green-100 border-green-500 text-green-800",
  error: "bg-red-100 border-red-500 text-red-800",
  warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
  info: "bg-blue-100 border-blue-500 text-blue-800",
};

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-600" />,
  error: <XCircle className="w-5 h-5 text-red-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  info: <Info className="w-5 h-5 text-blue-600" />,
};

const Alert = ({ type = "info", message, onClose, autoDismiss = 3000 }) => {
  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(onClose, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onClose]);

  return (
    <div
      className={`flex items-center p-3 rounded-lg border-l-4 shadow-md transition-opacity duration-300 ${alertStyles[type]}`}
    >
      {icons[type]}
      <span className="ml-2 flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Alert;

// const AlertExample = () => {
//   const [alert, setAlert] = useState(null);

//   return (
//     <div className="p-4 space-y-2">
//       <button
//         onClick={() =>
//           setAlert({ type: "success", message: "Action was successful!" })
//         }
//         className="px-4 py-2 bg-green-500 text-white rounded-md"
//       >
//         Show Success
//       </button>

//       {alert && (
//         <Alert
//           type={alert.type}
//           message={alert.message}
//           onClose={() => setAlert(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default AlertExample;
