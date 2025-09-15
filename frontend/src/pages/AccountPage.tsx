import { useState } from "react";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in with:", { email, password });
      alert("✅ Logged in successfully!");
    } else {
      console.log("Signing up with:", { name, email, password });
      alert("✅ Account created successfully!");
    }
  }

  return (
    <main className="account-container">
      {!isLogin ? (
        /* SIGN UP PAGE  */
        <div className="signup-box">
          <form className="signup-form" onSubmit={handleSubmit}>
            <label>Enter your username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Enter your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Enter your password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="btn-row">
              <button type="submit" className="btn">
                Sign Up
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setIsLogin(true)}
              >
                I have an account
              </button>
            </div>
          </form>

          <p className="signup-terms">
            By clicking <strong>Sign Up My Account</strong> and signing up, you
            agree to our <a href="/terms">Terms Of Services</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      ) : (
        /*  LOGIN PAGE */
        <div className="login-page">
          <div className="login-left">
            <h1 className="login-title">Log in. Level up.</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <label>Enter your Email</label>
              <div className="login-input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn">
                  Find Me
                </button>
              </div>
            </form>
          </div>

          <div className="login-right">
            <img src="/Buildings.png" alt="Login Illustration" />
          </div>
        </div>
      )}
    </main>
  );
}
