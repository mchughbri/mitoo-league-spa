function AppLogo({ className = "w-8 h-8" }) {
  return (
    <div
      className={`${className} rounded-xl bg-white/15 flex items-center justify-center ring-1 ring-white/25`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-[60%] h-[60%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.2l2.9 2.1-1.1 3.4h-3.6l-1.1-3.4L12 7.2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.2V4.3M14.9 9.3l2.8-.9M13.8 12.7l1.7 2.4M10.2 12.7l-1.7 2.4M9.1 9.3l-2.8-.9"
        />
      </svg>
    </div>
  );
}

export default AppLogo;
