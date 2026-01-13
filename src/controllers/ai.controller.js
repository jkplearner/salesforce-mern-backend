import Lead from "../models/Lead.js";
import Account from "../models/Account.js";
import Opportunity from "../models/Opportunity.js";
import { querySalesforce } from "../salesforceService.js";
import { buildAiPrompt } from "../utils/aiPromptBuilder.js";
import { generateResponse } from "../ai/gemini.client.js";

export const askAi = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0 || prompt.length > 2000) {
            return res.status(400).json({ answer: "Insufficient data" });
        }

        // 1. Fetch User's Data (Parallel for speed)
        const [userLeads, userAccounts, userOpps] = await Promise.all([
            Lead.find({ userId: req.user.id }),
            Account.find({ userId: req.user.id }),
            Opportunity.find({ userId: req.user.id }),
        ]);

        // 2. Fetch Details from Salesforce
        let leads = [];
        if (userLeads.length > 0) {
            const sfIds = userLeads.map((l) => `'${l.sfId}'`).join(",");
            leads = await querySalesforce(
                `SELECT Id, Salutation, FirstName, LastName, Company, Title, Email, Phone, MobilePhone, LeadSource, Industry, Status, AnnualRevenue, NumberOfEmployees FROM Lead WHERE Id IN (${sfIds})`
            );
        }

        let accounts = [];
        if (userAccounts.length > 0) {
            const sfIds = userAccounts.map((a) => `'${a.sfId}'`).join(",");
            accounts = await querySalesforce(
                `SELECT Id, Name, Phone, Industry, Type, Rating, Website FROM Account WHERE Id IN (${sfIds})`
            );
        }

        let opportunities = [];
        if (userOpps.length > 0) {
            const sfIds = userOpps.map((o) => `'${o.sfId}'`).join(",");
            opportunities = await querySalesforce(
                `SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity WHERE Id IN (${sfIds})`
            );
        }

        // 3. Format Strings
        const leadsStr = leads.map(l => JSON.stringify(l)).join("\n");
        const accountsStr = accounts.map(a => JSON.stringify(a)).join("\n");
        const oppsStr = opportunities.map(o => JSON.stringify(o)).join("\n");

        const fullData = `--- LEADS ---\n${leadsStr}\n\n--- ACCOUNTS ---\n${accountsStr}\n\n--- OPPORTUNITIES ---\n${oppsStr}`;

        // 4. Build Prompt
        const fullPrompt = buildAiPrompt("", fullData, prompt);

        // 5. Call Gemini
        const answer = await generateResponse(fullPrompt);

        // 6. Return (Strict JSON)
        res.json({ answer: answer.trim() });

    } catch (err) {
        console.error("🔥 AI CONTROLLER ERROR:", err.message);
        // Secure failure response
        res.json({ answer: "Insufficient data" });
    }
};
