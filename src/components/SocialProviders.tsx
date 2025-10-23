import React from "react";

type Props = {
  variant?: "sign-in" | "sign-up";
};

const SocialProviders: React.FC<Props> = ({ variant = "sign-in" }) => {
  return (
    <div className="space-y-3">
      {/* Google Button */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-light-300 bg-white px-4 py-3 text-body-medium text-dark-900 
             hover:bg-light-200 hover:scale-105 hover:shadow-md transition-transform duration-200 ease-in-out
             focus:outline-none focus:ring-2 focus:ring-dark-900/10"
        aria-label={`${
          variant === "sign-in" ? "Continue" : "Sign up"
        } with Google`}
      >
        <img src="/google.svg" alt="Google logo" width={18} height={18} />
        <span>
          {variant === "sign-in"
            ? "Continue with Google"
            : "Sign up with Google"}
        </span>
      </button>

      {/* Apple Button */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-light-300 bg-white px-4 py-3 text-body-medium text-dark-900 
             hover:bg-light-200 hover:scale-105 hover:shadow-md transition-transform duration-200 ease-in-out
             focus:outline-none focus:ring-2 focus:ring-dark-900/10"
        aria-label={`${
          variant === "sign-in" ? "Continue" : "Sign up"
        } with Apple`}
      >
        <img src="/apple.svg" alt="Apple logo" width={18} height={18} />
        <span>
          {variant === "sign-in" ? "Continue with Apple" : "Sign up with Apple"}
        </span>
      </button>
    </div>
  );
};

export default SocialProviders;
