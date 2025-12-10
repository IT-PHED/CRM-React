import {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/bg.jpg";
import { login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import phedlogo from "../assets/phed-logo.png";
import "./LoginForm.css";

export default function Login() {
  type FormData = { username: string; password: string };
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, type, checked } = e.target as HTMLInputElement;
    const name = (e.target as HTMLInputElement).name as keyof FormData;
    if (type === "checkbox") {
      setRemember(checked);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value } as FormData));
    }
  };


  useEffect(() => {
    const remembered = localStorage.getItem("rememberedUser");
    if (remembered) {
      setFormData((prev) => ({ ...prev, username: remembered }));
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.username, formData.password);

      // check for success and verified status
      if (result.success === true && result.data?.data?.isVerified){
        const serverUser = result.data?.userProfile || null;
        auth.login(result.data?.token, serverUser);
        if (remember) {
          localStorage.setItem("rememberedUser", formData.username);
        } else {
          localStorage.removeItem("rememberedUser");
        }
        navigate("/dashboard");
      } else if (result.success === true && !result.data?.data?.isVerified) {
        navigate("/otp-verification", { state: { saveUser: remember, userProfile: result.data?.data?.userProfile} });
      } else {
        setError("Invalid username or password.");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  // use Vite-imported asset (avoids referencing `process` in the browser)
  const backgroundImage = bgImage;
  const backgroundLayer = `linear-gradient(120deg, rgba(13, 148, 136, 0.8), rgba(5, 150, 105, 0.8)), url(${backgroundImage})`;
  const pageStyle: CSSProperties = {
    ["--login-bg" as any]: backgroundLayer,
  } as CSSProperties;

  return (
    <div className="login-page" style={pageStyle}>
      <div className="login-overlay" />
      <div className="login-content">
        <section className="login-hero">
          <p className="login-eyebrow">Play to Win By doing Right</p>
          <h1>
            Building a lasting <span>Customer Trust</span>
          </h1>
          <p>PHED Customer Service.</p>
          <div className="hero-card">
            <p>“You can be the Osifo of your time.”</p>
            <span>- Customer Service week 2025</span>
          </div>
        </section>

        <section className="login-panel">
          <div className="panel-header justify-center">
            <h2><img src={ phedlogo } alt="PHED LOGO" width="200"/></h2>
          </div>
          <p className="panel-subtitle">
            Welcome back
          </p>

          {error && <p className="alert">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Email or Staff ID</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="you@company.com"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <div className="form-row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="link">
                Forgot password?
              </button>
            </div>

            <button className="cta" disabled={loading}>
              {loading ? "Signing you in..." : "Open your workspace"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
