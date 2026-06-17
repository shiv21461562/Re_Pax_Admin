import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email === "admin@repax.com" && password === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        onLogin();
      } else {
        setError("Invalid email or password");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0a]">
      {/* Animated Dots Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Dots */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 20 + 10;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 15 + 12;
            const delay = Math.random() * 8;
            const opacity = Math.random() * 0.4 + 0.15;

            return (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-orange-400 to-orange-600"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  opacity: opacity,
                  animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`,
                  transform: "translateY(0)",
                  boxShadow: `0 0 ${size * 1.5}px rgba(251, 146, 60, ${opacity * 0.6})`,
                }}
              />
            );
          })}
        </div>

        {/* Extra Large Glowing Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse-slow delay-1500"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-3xl"></div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251, 146, 60, 0.3) 2px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/10 hover:border-orange-500/20 transition-all duration-500">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold">
              <span className="text-orange-500">RE</span>
              <span className="text-white">PAX</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-light tracking-wider">
              Admin Login
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center backdrop-blur-sm animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 placeholder:text-gray-500 text-white text-base"
              />
              <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-focus-within:border-orange-500/20 transition-all"></div>
            </div>

            {/* Password */}
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 placeholder:text-gray-500 text-white text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                {showPassword ? (
                  <FiEyeOff className="text-xl" />
                ) : (
                  <FiEye className="text-xl" />
                )}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer Line */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Secure Login • REPAX India 2026
            </p>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-60px) translateX(40px) scale(1.2);
          }
          50% {
            transform: translateY(40px) translateX(-40px) scale(0.8);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-40px) translateX(50px) scale(1.1);
          }
          100% {
            transform: translateY(50px) translateX(-50px) scale(0.9);
            opacity: 0.2;
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.6;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .delay-1500 {
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
}

export default Login;
