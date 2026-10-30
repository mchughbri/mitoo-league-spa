function AlertIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A2 2 0 004.18 21h15.64a2 2 0 001.87-2.96L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  );
}

function InboxIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12h4l2 3h6l2-3h4M5 12l1.5-6.5A2 2 0 018.44 4h7.12a2 2 0 011.94 1.5L19 12M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6"
      />
    </svg>
  );
}

function EmptyState({ variant = "empty", message }) {
  const isError = variant === "error";
  const Icon = isError ? AlertIcon : InboxIcon;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <Icon
        className={`w-10 h-10 ${
          isError ? "text-red-400" : "text-gray-300 dark:text-gray-600"
        }`}
      />
      <p
        className={`text-sm sm:text-base ${
          isError ? "text-red-500" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {message}
      </p>
    </div>
  );
}

export default EmptyState;
