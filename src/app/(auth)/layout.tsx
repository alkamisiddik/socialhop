import React from "react";
import Image from "next/image";

export const metadata = {
  title: "Authentication",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-w-dvw min-h-dvh bg-[#FFEDC9] flex items-center justify-center p-4">
      <div className="min-h-[85vh] w-full max-w-6xl bg-white rounded-[20px] shadow-[0px_4px_32.3px_0px_rgba(0,0,0,0.07)] flex flex-col md:flex-row overflow-hidden">
        {/* Left Section (Form) */}
        <div className="flex-1 flex items-center justify-center p-6">
          {children}
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-[var(--primary)]">
          <Image
            alt="Auth Image"
            width={400}
            height={400}
            quality={100}
            src={"/images/auth.png"}
            className="w-full h-auto max-w-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
