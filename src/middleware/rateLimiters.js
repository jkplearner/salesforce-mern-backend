import rateLimit from "express-rate-limit";

// ==========================================
// KEY GENERATOR (Safe for all)
// ==========================================
// Uses User ID if authenticated, otherwise IP address.
const keyGenerator = (req) => {
    return req.user?.id || req.ip;
};

// ==========================================
// 1. GLOBAL FLOOD PROTECTION
// ==========================================
// Basic DOS protection for the entire server.
// 300 requests per 15 minutes per IP.
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again after 15 minutes" },
    keyGenerator: (req) => req.ip, // Global flood check should be IP based always
});

// ==========================================
// 2. AUTH PROTECTION (Strict)
// ==========================================
// Prevent brute force on login/signup.
// 5 FAILED requests per hour. Successes don't count towards the lock-out.
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Crucial: Only restrict failures
    message: { error: "Too many failed login attempts, please try again in an hour" },
    keyGenerator: (req) => req.ip, // Auth is usually pre-login, so IP based
});

// ==========================================
// 3. AI ENDPOINT PROTECTION (Critical)
// ==========================================
// Protects Salesforce Quota and Gemini Costs.
// 5 requests per hour.
// 1 AI req = 3 SF calls. 5 reqs = 15 SF calls cost.
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { answer: "AI query limit reached. Please try again in an hour." }, // Match AI response format
    keyGenerator: keyGenerator,
});

// ==========================================
// 4. SALESFORCE DATA LIMITER
// ==========================================
// For Leads, Accounts, Opportunities CRUD.
// 50 requests per 15 mins.
export const sfDataLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Salesforce interaction limit reached. Please slow down." },
    keyGenerator: keyGenerator,
});

// ==========================================
// 5. LOCAL RESOURCE LIMITER
// ==========================================
// For Tasks, Notes, and GetMe.
// 150 requests per 15 mins.
export const mongoLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Request limit reached for local resources." },
    keyGenerator: keyGenerator,
});
