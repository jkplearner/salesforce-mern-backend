export const mapToSalesforce = (body, type) => {
    const mapped = {};

    // COMMON FIELDS
    if (body.phone) mapped.Phone = body.phone;
    if (body.fax) mapped.Fax = body.fax;
    if (body.website) mapped.Website = body.website;
    if (body.numberOfEmployees) mapped.NumberOfEmployees = body.numberOfEmployees;
    if (body.annualRevenue) mapped.AnnualRevenue = body.annualRevenue;
    if (body.description) mapped.Description = body.description;

    // ACCOUNT FIELDS
    if (type === "Account") {
        const name = body.name || body.accountName;
        if (name) mapped.Name = name;

        if (body.parentId) mapped.ParentId = body.parentId;
        if (body.accountNumber) mapped.AccountNumber = body.accountNumber;
        if (body.site) mapped.Site = body.site;
        if (body.tickerSymbol) mapped.TickerSymbol = body.tickerSymbol;
        if (body.type) mapped.Type = body.type;
        if (body.ownership) mapped.Ownership = body.ownership;
        if (body.industry) mapped.Industry = body.industry;
        if (body.sicCode) mapped.Sic = body.sicCode;
        if (body.lastInteractionDate) mapped.Last_Interaction_Date__c = body.lastInteractionDate;
    }

    // LEAD FIELDS
    if (type === "Lead") {
        if (body.salutation) mapped.Salutation = body.salutation;
        if (body.firstName) mapped.FirstName = body.firstName;
        if (body.lastName) mapped.LastName = body.lastName;
        if (body.mobilePhone) mapped.MobilePhone = body.mobilePhone;
        if (body.company) mapped.Company = body.company;
        if (body.title) mapped.Title = body.title;
        if (body.email) mapped.Email = body.email;
        if (body.leadSource) mapped.LeadSource = body.leadSource;
        if (body.industry) mapped.Industry = body.industry;
        if (body.status) mapped.Status = body.status;
    }

    // OPPORTUNITY FIELDS
    if (type === "Opportunity") {
        if (body.name) mapped.Name = body.name;
        if (body.amount) mapped.Amount = body.amount;
        if (body.stage) mapped.StageName = body.stage;
        if (body.stagename) mapped.StageName = body.stagename;
        if (body.stageName) mapped.StageName = body.stageName;
        if (body.closeDate) mapped.CloseDate = body.closeDate;
        if (body.region) mapped.Region__c = body.region;
    }

    return mapped;
};

export const mapToClient = (record) => {
    return record; // passthrough
};
