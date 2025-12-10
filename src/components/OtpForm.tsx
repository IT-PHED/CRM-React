import { useState, FormEvent, CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import bgImage from "../assets/images/bg.jpg";
import { verifyOtp } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import phedlogo from "../assets/phed-logo.png";
import "./LoginForm.css";

export default function OtpForm() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const { saveUser, userProfile } = location.state || {};

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Email:", userProfile?.emailId, "status:", saveUser);
      const result = await verifyOtp(userProfile?.emailId, userProfile?.userName, otp);

      if (result.success === true) {
        auth.login(result.data?.token, userProfile);
        
        if (saveUser && userProfile?.emailId) {
          localStorage.setItem("rememberedUser", userProfile.userName);
        } else {
          localStorage.removeItem("rememberedUser");
        }     
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Call your resend OTP API here
      // await resendOtp(userProfile?.email || userProfile?.staffId);
      setError(""); // Clear any previous errors
      // You can show a success message here if needed
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

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
            <p>"You can be the Osifo of your time."</p>
            <span>- Customer Service week 2025</span>
          </div>
        </section>

        <section className="login-panel">
          <div className="panel-header justify-center">
            <h2>
              <img src={phedlogo} alt="PHED LOGO" width="200" />
            </h2>
          </div>
          <p className="panel-subtitle">Enter verification code</p>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
            We've sent a 6-digit code to your email
          </p>

          {error && <p className="alert">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <button className="cta" type="submit" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Didn't receive the code?{" "}
              </span>
              <button
                type="button"
                className="link"
                onClick={handleResend}
                disabled={loading}
                style={{ fontSize: "0.875rem" }}
              >
                Resend OTP
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                type="button"
                className="link"
                onClick={() => navigate("/")}
                style={{ fontSize: "0.875rem" }}
              >
                ← Back to login
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}