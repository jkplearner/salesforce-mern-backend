import { getPicklists } from "../utils/validationHelper.js";

export const getAccountMetadata = (req, res) => {
    res.json({
        object: "Account",
        fields: {
            Name: { label: "Account Name", type: "text", required: true },
            Phone: { label: "Phone", type: "text" },
            ParentId: { label: "Parent Account", type: "lookup" },
            Fax: { label: "Fax", type: "text" },
            AccountNumber: { label: "Account Number", type: "text" },
            Website: { label: "Website", type: "url" },
            Site: { label: "Account Site", type: "text" },
            TickerSymbol: { label: "Ticker Symbol", type: "text" },
            Type: { label: "Type", type: "picklist", values: getPicklists("Account").Type },
            Ownership: { label: "Ownership", type: "picklist", values: getPicklists("Account").Ownership },
            Industry: { label: "Industry", type: "picklist", values: getPicklists("Account").Industry },
            NumberOfEmployees: { label: "Employees", type: "number" },
            AnnualRevenue: { label: "Annual Revenue", type: "currency" },
            Sic: { label: "SIC Code", type: "text" },
            Last_Interaction_Date__c: { label: "Last Interaction Date", type: "date" }
        }
    });
};

export const getLeadMetadata = (req, res) => {
    res.json({
        object: "Lead",
        fields: {
            Salutation: { label: "Salutation", type: "text" },
            FirstName: { label: "First Name", type: "text" },
            LastName: { label: "Last Name", type: "text", required: true },
            Company: { label: "Company", type: "text", required: true },
            Status: { label: "Lead Status", type: "picklist", required: true, values: getPicklists("Lead").Status },
            Phone: { label: "Phone", type: "text" },
            MobilePhone: { label: "Mobile", type: "text" },
            Fax: { label: "Fax", type: "text" },
            Title: { label: "Title", type: "text" },
            Email: { label: "Email", type: "email" },
            LeadSource: { label: "Lead Source", type: "picklist", values: getPicklists("Lead").LeadSource },
            Website: { label: "Website", type: "url" },
            Industry: { label: "Industry", type: "picklist", values: getPicklists("Lead").Industry },
            AnnualRevenue: { label: "Annual Revenue", type: "currency" },
            NumberOfEmployees: { label: "No. of Employees", type: "number" }
        }
    });
};

export const getTaskMetadata = (req, res) => {
    res.json({
        object: "Task",
        fields: {
            subject: { label: "Subject", type: "text", required: true },
            dueDate: { label: "Due Date", type: "date" },
            status: { label: "Status", type: "picklist", values: getPicklists("Task").Status },
            priority: { label: "Priority", type: "picklist", values: getPicklists("Task").Priority },
            relatedSfId: { label: "Related Salesforce ID", type: "text" }
        }
    });
};

export const getOpportunityMetadata = (req, res) => {
    res.json({
        object: "Opportunity",
        fields: {
            Name: { label: "Name", type: "text", required: true },
            Amount: { label: "Amount", type: "currency" },
            StageName: { label: "Stage", type: "text", required: true },
            CloseDate: { label: "Close Date", type: "date", required: true }
        }
    });
};
