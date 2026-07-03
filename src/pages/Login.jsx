import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import logo from "../assets/logo.png";

import { loginAdmin } from "../services/AuthApi";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setIsLoading(true);

      const response = await loginAdmin({
        email,
        password,
      });

      if (response.success) {
        // localStorage.setItem("token", response.data.token);
        // localStorage.setItem("isLoggedIn", "true");

        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("isLoggedIn", "true");

        onLogin();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Login failed");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop')",
        }}
      />

      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />

      {/* Login Card */}
      <div
        className="
          relative z-10
          w-full
          max-w-[480px]
          mx-5
          rounded-[40px]
          border
          border-white/20
          bg-black/40
          backdrop-blur-[30px]
          shadow-[0_25px_80px_rgba(0,0,0,0.55)]
          p-10
        "
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="REPAX"
            className="h-20 mx-auto object-contain drop-shadow-lg"
          />

          <p className="mt-3 text-white/70 text-lg">
            Summit India Admin Portal
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-500/15 border border-red-400/20 p-3 text-center text-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-white mb-2 text-sm">
              Email Address
            </label>

            <div className="relative">
              <FiMail
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
                size={20}
              />

              <input
                type="email"
                placeholder="admin@repax.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
w-full
h-16
rounded-2xl
bg-transparent
border
border-white/20
pl-14
pr-5
text-white
placeholder:text-white/50
backdrop-blur-md
outline-none
focus:border-[#FF6B00]
focus:bg-white/15
transition-all
"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white mb-2 text-sm">Password</label>

            <div className="relative">
              <FiLock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
        w-full
        h-16
        rounded-2xl
       bg-transparent
        border
        border-white/30
        pl-14
        pr-14
        text-white
        placeholder:text-white/40
        backdrop-blur-md
        outline-none
        focus:border-[#ff6b00]
      "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="
    w-full
    h-16
    rounded-2xl
    bg-[#ff6b00]
    text-white
    text-lg
    font-bold
    border
    border-[#ff8c42]
  
    transition-all
    duration-300
   
    hover:scale-[1.02]
  "
          >
            {isLoading ? "Signing In..." : "LOGIN"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/60 mt-8 text-sm">
          © 2026 REPAX Summit India
        </p>
      </div>
    </div>
  );
}

export default Login;
