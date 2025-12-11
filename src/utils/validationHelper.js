const picklists = {
    Account: {
        Type: [
            "Prospect",
            "Customer - Direct",
            "Customer - Channel",
            "Channel Partner / Reseller",
            "Installation Partner",
            "Technology Partner",
            "Other",
        ],
        Ownership: ["Public", "Private", "Subsidiary", "Other"],
        Industry: [
            "Agriculture", "Apparel", "Banking", "Biotechnology", "Chemicals",
            "Communications", "Construction", "Consulting", "Education",
            "Electronics", "Energy", "Engineering", "Entertainment",
            "Environmental", "Finance", "Food & Beverage", "Government",
            "Healthcare", "Hospitality", "Insurance", "Machinery",
            "Manufacturing", "Media", "Not For Profit", "Recreation",
            "Retail", "Shipping", "Technology", "Telecommunications",
            "Transportation", "Utilities", "Other"
        ]
    },

    Lead: {
        LeadSource: ["Web", "Phone Inquiry", "Partner Referral", "Purchased List", "Other"],
        Industry: [
            "Agriculture", "Apparel", "Banking", "Biotechnology", "Chemicals",
            "Communications", "Construction", "Consulting", "Education",
            "Electronics", "Energy", "Engineering", "Entertainment",
            "Environmental", "Finance", "Food & Beverage", "Government",
            "Healthcare", "Hospitality", "Insurance", "Machinery",
            "Manufacturing", "Media", "Not For Profit", "Recreation",
            "Retail", "Shipping", "Technology", "Telecommunications",
            "Transportation", "Utilities", "Other"
        ],
        Status: [
            "Open - Not Contacted",
            "Working - Contacted",
            "Closed - Converted",
            "Closed - Not Converted"
        ],
        Rating: ["Hot", "Warm", "Cold"]
    },

    Task: {
        Status: ["Not Started", "In Progress", "Completed", "Waiting on someone else", "Deferred"],
        Priority: ["High", "Normal", "Low"]
    }
};

// Helper → read either camelCase OR PascalCase
const getField = (body, field) => {
    return (
        body[field] ||
        body[field.charAt(0).toLowerCase() + field.slice(1)]
    );
};

export const validateSalesforceBody = (type, body) => {
    const errors = [];
    const validPicklists = picklists[type] || {};

    // -------------------------------
    // REQUIRED FIELD VALIDATION
    // -------------------------------

    if (type === "Account") {
        const name = getField(body, "Name") || getField(body, "AccountName");
        if (!name) errors.push("Name is required");
    }

    if (type === "Lead") {
        const lastName = getField(body, "LastName");
        const company = getField(body, "Company");
        const status = getField(body, "Status");

        if (!lastName) errors.push("LastName is required");
        if (!company) errors.push("Company is required");
        if (!status) errors.push("Status is required");
    }

    if (type === "Opportunity") {
        const name = getField(body, "Name");
        const stage = getField(body, "StageName") || getField(body, "Stage");
        const closeDate = getField(body, "CloseDate");

        if (!name) errors.push("Name is required");
        if (!stage) errors.push("StageName is required");
        if (!closeDate) errors.push("CloseDate is required");
        if (!getField(body, "Region__c") && !getField(body, "region")) errors.push("Region is required");
    }

    // -------------------------------
    // PICKLIST VALIDATION
    // -------------------------------
    Object.keys(validPicklists).forEach((field) => {
        const value =
            body[field] ||
            body[field.charAt(0).toLowerCase() + field.slice(1)];

        if (value && !validPicklists[field].includes(value)) {
            errors.push(
                `Invalid value for ${field}. Allowed: ${validPicklists[field].join(", ")}`
            );
        }
    });

    return errors;
};

export const getPicklists = (type) => picklists[type] || {};
