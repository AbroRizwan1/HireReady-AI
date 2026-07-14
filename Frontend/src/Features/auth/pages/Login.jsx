
import { useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import InputField, { EyeOpenIcon, EyeOffIcon } from "../components/InputFields";
import "../style/LoginAnimation.css";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const { loading, user, error, setError, handleLogin } = useAuth()

    const [form, setForm] = useState({
        email: "",
        password: "",
    });


    const [showPass, setShowPass] = useState(false);
    const [focused, setFocused] = useState(null);

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(form);

    };


    const handleChange = (field) => (e) => {
        const value = e.target.value;

        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

    };



    return (
        // Page wrapper — full viewport height, vertically centered
        <div
            className="min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden relative"
            style={{ background: "#37353E" }}
        >

            {/* Background decorative blobs — purely visual */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
                    style={{ background: "#715A5A" }}
                />
                <div
                    className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse"
                    style={{ background: "#44444E", animationDelay: "1.2s" }}
                />
            </div>

            {/* Card — .login-card triggers slide-up entrance (loginAnimations.css) */}
            <div
                className="relative w-full max-w-md rounded-2xl p-8 sm:p-10 shadow-2xl login-card"
                style={{
                    background: "#44444E",
                    border: "1px solid rgba(211,218,217,0.12)",
                }}
            >

                {/* Header */}
                <div className="mb-8 text-center">
                    <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
                        style={{ background: "#37353E", border: "1px solid rgba(113,90,90,0.5)" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7"
                            fill="none" viewBox="0 0 24 24" stroke="#715A5A" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#D3DAD9" }}>
                        Welcome back
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: "rgba(211,218,217,0.55)" }}>
                        Sign in to continue your session
                    </p>
                </div>

                {/* Success state — .success-appear triggers scale+fade (loginAnimations.css) */}

                <div className="flex flex-col gap-5">

                    {/* Email field — imported from InputField.jsx */}
                    <InputField
                        id="email"
                        label="Email address"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))}
                        placeholder="you@example.com"
                        focused={focused}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                    />

                    {/* Password field with eye toggle — imported from InputField.jsx */}
                    <InputField
                        id="password"
                        label="Password"
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))}
                        placeholder="••••••••"
                        focused={focused}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)}
                    >
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 transition-opacity duration-200 hover:opacity-70"
                            style={{ color: "rgba(211,218,217,0.5)" }}
                            aria-label={showPass ? "Hide password" : "Show password"}
                        >
                            {showPass ? <EyeOffIcon /> : <EyeOpenIcon />}
                        </button>
                    </InputField>

                    {/* Error message — .error-shake triggers horizontal shake (loginAnimations.css)
                key={error} replays the animation on each new error */}

                    {error?.message && (
                        <p
                            key={error?.message}
                            className="text-xs px-3 py-2 rounded-lg error-shake"
                            style={{
                                background: "rgba(113,90,90,0.18)",
                                color: "#D3DAD9",
                                border: "1px solid rgba(113,90,90,0.4)",
                                height: "auto"
                            }}
                        >
                            ⚠ {error.message}
                        </p>
                    )}

                    {/* Submit button — shows spinner while loading */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="relative w-full py-3 cursor-pointer rounded-xl text-sm font-semibold tracking-wide
                         transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-70 disabled:cursor-not-allowed mt-1"
                        style={{
                            background: "#715A5A",
                            color: "#D3DAD9",
                            boxShadow: "0 4px 20px rgba(113,90,90,0.35)",
                        }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                {/* Spinner — Tailwind animate-spin utility */}
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Signing in…
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    {/* Link to registration page */}
                    <p className="text-center text-xs mt-2" style={{ color: "rgba(211,218,217,0.45)" }}>
                        Don't have an account?{" "}
                        <button
                            onClick={(e) => { navigate("/register") }}
                            type="button"
                            className="font-semibold cursor-pointer transition-colors duration-200 hover:opacity-80"
                            style={{ color: "#715A5A" }}
                        >
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}