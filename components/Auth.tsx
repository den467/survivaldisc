
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';
import { db } from '../services/db';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Password strength calculation
  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length > 6) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9]/.test(p)) s += 25;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return s;
  };

  const strength = getStrength(password);

  useEffect(() => {
    if (loading && !isLogin) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [loading, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 800)); // Simulate decryption
      const user = db.login(email.toLowerCase(), password);
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid email or password. Please check your master key.");
        setLoading(false);
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!agreed) {
        setError("You must accept the terms of service.");
        return;
      }
      if (strength < 50) {
        setError("Password is too weak for secure encryption.");
        return;
      }

      setLoading(true);
      // Wait for the "progress" to hit 100
      await new Promise(r => setTimeout(r, 3500));

      const newUser: UserProfile = {
        name: `${firstName} ${lastName}`.trim(),
        email: email.toLowerCase(),
        tier: 'Survivor',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
        joinDate: new Date().toLocaleDateString(),
      };

      const success = db.register(newUser, password);
      if (success) {
        db.login(email.toLowerCase(), password);
        onLogin(newUser);
      } else {
        setError("This email is already associated with an account.");
        setLoading(false);
        setProgress(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-mega-red rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-white text-5xl font-black">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SurvivalDisc</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-semibold">User-Controlled Encryption</p>
        </div>

        <div className="bg-white rounded-xl auth-card overflow-hidden shadow-2xl">
          {loading && !isLogin ? (
            <div className="p-12 text-center space-y-6">
              <Loader2 size={48} className="text-mega-red animate-spin mx-auto" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Creating Your Master Key</h3>
                <p className="text-gray-500 text-sm mt-2">Generating RSA-2048 encryption pair...</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-mega-red h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 font-bold">{progress}% complete</p>
            </div>
          ) : (
            <div className="p-10">
              <div className="flex border-b border-gray-100 mb-8">
                <button 
                  onClick={() => { setIsLogin(true); setError(null); }}
                  className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider transition-all ${isLogin ? 'text-mega-red border-b-2 border-mega-red' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setIsLogin(false); setError(null); }}
                  className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider transition-all ${!isLogin ? 'text-mega-red border-b-2 border-mega-red' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Create Account
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center mb-6 text-sm font-medium border border-red-100">
                  <AlertCircle size={18} className="mr-3 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-mega-red focus:border-mega-red outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-mega-red focus:border-mega-red outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-mega-red focus:border-mega-red outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-mega-red focus:border-mega-red outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strength < 30 ? 'bg-red-500' : strength < 70 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                          style={{ width: `${strength}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                        <span>Strength</span>
                        <span className={strength < 30 ? 'text-red-500' : strength < 70 ? 'text-yellow-600' : 'text-green-600'}>
                          {strength < 30 ? 'Weak' : strength < 70 ? 'Good' : 'Very Strong'}
                        </span>
                      </div>
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-mega-red focus:border-mega-red outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="flex items-start space-x-3 pt-2">
                      <input
                        type="checkbox"
                        id="agreed"
                        required
                        className="mt-1 w-4 h-4 text-mega-red border-gray-300 rounded focus:ring-mega-red"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <label htmlFor="agreed" className="text-xs text-gray-500 leading-relaxed">
                        I agree to the <span className="text-mega-red font-bold">Terms of Service</span> and acknowledge that SurvivalDisc uses zero-knowledge encryption; if I lose my master key, my data is permanently inaccessible.
                      </label>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-mega-red text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-600 transition-all flex items-center justify-center space-x-3 active:scale-[0.98] disabled:opacity-70 mt-4"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Unlock Vault' : 'Initialize Vault'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                  Encrypted via RSA-2048 & AES-256-GCM
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} SURVIVALDISC SECURE CLOUD
        </div>
      </div>
    </div>
  );
};

// Fixed: Added missing default export
export default Auth;
