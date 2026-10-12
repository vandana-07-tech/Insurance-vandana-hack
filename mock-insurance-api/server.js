const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;


if (process.env.ENABLE_TEST_ENDPOINTS === "true") {
    app.get("/__test/ping", (_req, res) => {
        res.json({
            status: "UP",
            testOnly: true,
            application: "Insurance Fraud Detection API"
        });
    });
}
  const claims = [];
 
app.post("/claims", (req, res) => {
 
    const claim = req.body;
 
    let status = "ACCEPTED";
    let fraudRule = null;
 
    // RULE-001
    if (claim.claimAmount > claim.policyLimit) {
        status = "FLAGGED";
        fraudRule = "RULE-001";
    }
 
    // RULE-002
    if (claim.policyStatus === "EXPIRED") {
        status = "FLAGGED";
        fraudRule = "RULE-002";
    }
    // RULE-003
    if (claim.claimAmount > 10000 && claim.claimType === "THEFT") {
        status = "FLAGGED";
        fraudRule = "RULE-003";
    }
    //RULE-004
    if (claim.claimType === "FIRE" && claim.claimAmount > 5000) {
        status = "FLAGGED";
        fraudRule = "RULE-004";
    }
    //RULE-005 
    if (claim.claimType === "WATER_DAMAGE" && claim.claimAmount > 3000) {
        status = "FLAGGED";
        fraudRule = "RULE-005";
    }
    //RULE-006
    if (claim.claimType === "ACCIDENT" && claim.claimAmount > 7000) {
        status = "FLAGGED";
        fraudRule = "RULE-006";
    }
    //RULE-007
    if (claim.claimType === "NATURAL_DISASTER" && claim.claimAmount > 15000) {
        status = "FLAGGED";
        fraudRule = "RULE-007";
    }
    //RULE-008
    if (claim.claimType === "VANDALISM" && claim.claimAmount > 2000) {
        status = "FLAGGED";
        fraudRule = "RULE-008";
    }
    //RULE-009
    if (claim.claimType === "MEDICAL" && claim.claimAmount > 8000) {
        status = "FLAGGED";
        fraudRule = "RULE-009";
    }
    //RULE-010
    if (claim.claimType === "TRAVEL" && claim.claimAmount > 4000) {
        status = "FLAGGED";
        fraudRule = "RULE-010";
    }
    //RULE-011
    if (claim.claimType === "JEWELRY" && claim.claimAmount > 6000) {
        status = "FLAGGED";
        fraudRule = "RULE-011";
    }
    //RULE-012
    if (claim.claimType === "ELECTRONICS" && claim.claimAmount > 5000) {
        status = "FLAGGED";
        fraudRule = "RULE-012";
    }
    //RULE-013
    if (claim.claimType === "CATASTROPHIC" && claim.claimAmount > 20000) {
        status = "FLAGGED";
        fraudRule = "RULE-013";
    }
    //RULE-014
    if (claim.claimType === "LIABILITY" && claim.claimAmount > 10000) {
        status = "FLAGGED";
        fraudRule = "RULE-014";
    }
    ///RULE-015
    if (claim.claimType === "PROPERTY_DAMAGE" && claim.claimAmount > 8000) {
        status = "FLAGGED";
        fraudRule = "RULE-015";
    }
    //RULE-016
    if (claim.claimType === "BUSINESS INTERRUPTION" && claim.claimAmount > 12000) {
        status = "FLAGGED";
        fraudRule = "RULE-016";
    }
    //RULE-017
    if (claim.claimType === "CYBER" && claim.claimAmount > 9000) {
        status = "FLAGGED";
        fraudRule = "RULE-017";
    }
    //RULE-018
    if (claim.claimType === "ENVIRONMENTAL" && claim.claimAmount > 11000) {
        status = "FLAGGED";
        fraudRule = "RULE-018";
    }
    //RULE-019
    if (claim.claimType === "PRODUCT LIABILITY" && claim.claimAmount > 13000) {
        status = "FLAGGED";
        fraudRule = "RULE-019";
    }
    //RULE-020
    if (claim.claimType === "WORKERS COMPENSATION" && claim.claimAmount > 14000) {
        status = "FLAGGED";
        fraudRule = "RULE-020";
    }
    //RULE-021
    if (claim.claimType === "AUTO" && claim.claimAmount > 15000) {
        status = "FLAGGED";
        fraudRule = "RULE-021";
    }
    //RULE-022
    if (claim.claimType === "MARINE" && claim.claimAmount > 16000) {
        status = "FLAGGED";
        fraudRule = "RULE-022";
    }
    //RULE-023
    if (claim.claimType === "AVIATION" && claim.claimAmount > 17000) {
        status = "FLAGGED";
        fraudRule = "RULE-023";
    }
    //RULE-024
    if (claim.claimType === "AGRICULTURE" && claim.claimAmount > 18000) {
        status = "FLAGGED";
        fraudRule = "RULE-024";
    }
    //RULE-025
    if (claim.claimType === "RECREATIONAL" && claim.claimAmount > 19000) {
        status = "FLAGGED";
        fraudRule = "RULE-025";
    }
 
    claims.push(claim);
 
    res.status(201).json({
        claimId: claim.claimId,
        status: status,
        fraudRule: fraudRule
    });
});

/*
========================================
MASTER DATA
========================================
*/

const claimsDB = [];

const blacklistCustomers = [
    "CUST999",
    "CUST888",
    "CUST777"
];

const highRiskLocations = [
    "FraudCity",
    "RiskTown",
    "BlackZone"
];

const documentHashes = new Set();
const imageHashes = new Set();

/*
========================================
FRAUD CONFIGURATION
========================================
*/

const FRAUD_RULES = {
    DUPLICATE_WINDOW_HOURS: 24,
    HIGH_RISK_SCORE: 80,
    MEDIUM_RISK_SCORE: 50,
    POLICY_AGE_DAYS_THRESHOLD: 30,
    MAX_CUSTOMER_CLAIMS: 3,
    MAX_VEHICLE_CLAIMS: 3
};

/*
========================================
UTILITY FUNCTIONS
========================================
*/

function getRiskLevel(score) {
    if (score >= FRAUD_RULES.HIGH_RISK_SCORE)
        return "HIGH";

    if (score >= FRAUD_RULES.MEDIUM_RISK_SCORE)
        return "MEDIUM";

    return "LOW";
}

function getRecommendation(score) {

    if (score >= 80)
        return "INVESTIGATE";

    if (score >= 50)
        return "MANUAL_REVIEW";

    return "AUTO_APPROVE";
}

function calculatePolicyAge(policyStartDate) {

    return Math.floor(
        (Date.now() - new Date(policyStartDate))
        / (1000 * 60 * 60 * 24)
    );
}

/*
========================================
FRAUD ENGINE
========================================
*/

function evaluateFraud(claim) {

    let fraudScore = 0;
    let fraudFlags = [];
    let fraudRuleIds = [];
    let claimStatus = "APPROVED";

    /*
    RULE-026: Duplicate Claim Detection
    */
    const duplicateClaim = claimsDB.find(existing =>
        existing.customerId === claim.customerId &&
        existing.vehicleNumber === claim.vehicleNumber &&
        existing.incidentDate === claim.incidentDate &&
        existing.claimAmount === claim.claimAmount
    );

    if (duplicateClaim) {
        fraudFlags.push("DUPLICATE_CLAIM");
        fraudRuleIds.push("RULE-026");
        fraudScore += 40;
    }

    /*
    RULE-027: Multiple Claims by Customer
    */
    const customerClaimCount =
        claimsDB.filter(c =>
            c.customerId === claim.customerId
        ).length;

    if (customerClaimCount > FRAUD_RULES.MAX_CUSTOMER_CLAIMS) {
        fraudFlags.push("FREQUENT_CLAIMER");
        fraudRuleIds.push("RULE-027");
        fraudScore += 20;
    }

    /*
    RULE-028: Vehicle Claim Count
    */
    const vehicleClaimCount =
        claimsDB.filter(c =>
            c.vehicleNumber === claim.vehicleNumber
        ).length;

    if (vehicleClaimCount > FRAUD_RULES.MAX_VEHICLE_CLAIMS) {
        fraudFlags.push("MULTIPLE_VEHICLE_CLAIMS");
        fraudRuleIds.push("RULE-028");
        fraudScore += 25;
    }

    /*
    RULE-029: Blacklist Validation
    */
    if (
        blacklistCustomers.includes(claim.customerId)
    ) {
        fraudFlags.push("BLACKLISTED_CUSTOMER");
        fraudRuleIds.push("RULE-029");
        fraudScore += 50;
    }

    /*
    RULE-030: New Policy Validation
    */
    const policyAge =
        calculatePolicyAge(claim.policyStartDate);

    if (
        policyAge <
        FRAUD_RULES.POLICY_AGE_DAYS_THRESHOLD
    ) {
        fraudFlags.push("NEW_POLICY_HIGH_RISK");
        fraudRuleIds.push("RULE-030");
        fraudScore += 30;
    }

    /*
    RULE-031: Exceeds Coverage
    */
    if (
        claim.claimAmount >
        claim.policyCoverage
    ) {

        fraudFlags.push("EXCEEDS_POLICY_LIMIT");
    fraudRuleIds.push("RULE-031");
        fraudScore += 35;
        claimStatus = "REJECTED";
    }

    /*
    RULE-032: High Claim Ratio
    */
    const percentage =
        (claim.claimAmount /
            claim.policyCoverage) * 100;

    if (percentage > 90) {
        fraudFlags.push("HIGH_CLAIM_RATIO");
        fraudRuleIds.push("RULE-032");
        fraudScore += 15;
    }

    /*
    RULE-033: Document Reuse
    */
    if (
        claim.documentHash &&
        documentHashes.has(claim.documentHash)
    ) {
        fraudFlags.push("DOCUMENT_REUSE");
        fraudRuleIds.push("RULE-033");
        fraudScore += 40;
    }

    /*
    RULE-034: Image Reuse
    */
    if (
        claim.imageHash &&
        imageHashes.has(claim.imageHash)
    ) {
        fraudFlags.push("IMAGE_DUPLICATE");
        fraudRuleIds.push("RULE-034");
        fraudScore += 40;
    }

    /*
    RULE-035: Identity Validation
    */
    if (
        claim.customerVerified === false
    ) {
        fraudFlags.push("IDENTITY_MISMATCH");
        fraudRuleIds.push("RULE-035");
        fraudScore += 50;
    }

    /*
    RULE-036: Multiple Policies Exploitation
    */
    const sameIncidentClaims =
        claimsDB.filter(c =>
            c.incidentDate === claim.incidentDate &&
            c.customerId === claim.customerId
        );

    if (sameIncidentClaims.length > 0) {
        fraudFlags.push("MULTIPLE_POLICY_EXPLOIT");
        fraudRuleIds.push("RULE-036");
        fraudScore += 45;
    }

    /*
    RULE-037: High Risk Location
    */
    if (
        highRiskLocations.includes(claim.claimCity)
    ) {
        fraudFlags.push("HIGH_RISK_LOCATION");
        fraudRuleIds.push("RULE-037");
        fraudScore += 20;
    }

    /*
    RULE-038: Odd Hour Detection
    */
    const claimHour =
        new Date().getHours();

    if (
        claimHour >= 0 &&
        claimHour <= 4
    ) {
        fraudFlags.push("ODD_HOUR_CLAIM");
        fraudRuleIds.push("RULE-038");
        fraudScore += 10;
    }

    /*
    RULE-039: Previous Rejections
    */
    const previousRejectedClaims =
        claimsDB.filter(c =>
            c.customerId === claim.customerId &&
            c.claimStatus === "REJECTED"
        ).length;

    if (previousRejectedClaims > 0) {
        fraudFlags.push("REPEATED_REJECTION");
        fraudRuleIds.push("RULE-039");
        fraudScore += 15;
    }

    /*
    Cap Fraud Score
    */
    fraudScore = Math.min(fraudScore, 100);

    return {
        fraudScore,
        fraudFlags,
        fraudRuleIds,
        claimStatus,
        riskLevel: getRiskLevel(fraudScore),
        recommendation:
            getRecommendation(fraudScore)
    };
}

/*
========================================
CREATE CLAIM API
========================================
*/

app.post(
    "/createClaim",
    (req, res) => {

        const claim = req.body;

        const fraudResult =
            evaluateFraud(claim);

        const finalClaim = {
            claimId:
                `CLM-${Date.now()}`,
            ...claim,
            ...fraudResult
        };

        claimsDB.push(finalClaim);

        if (claim.documentHash) {
            documentHashes.add(
                claim.documentHash
            );
        }

        if (claim.imageHash) {
            imageHashes.add(
                claim.imageHash
            );
        }

        res.status(201).json(finalClaim);
    }
);

/*
========================================
GET ALL CLAIMS
========================================
*/

app.get(
    "/claims",
    (_req, res) => {
        res.json(claimsDB);
    }
);

/*
========================================
VALIDATE FRAUD
========================================
*/

app.post(
    "/validateFraud",
    (req, res) => {

        const fraudResult =
            evaluateFraud(req.body);

        res.json(fraudResult);
    }
);

/*
========================================
GET CLAIM BY ID
========================================
*/

app.get(
    "/claims/:claimId",
    (req, res) => {

        const claim =
            claimsDB.find(
                c =>
                c.claimId ===
                req.params.claimId
            );

        if (!claim) {
            return res.status(404).json({
                message: "Claim Not Found"
            });
        }

        res.json(claim);
    }
);

/*
========================================
DASHBOARD
========================================
*/

app.get(
    "/dashboard",
    (_req, res) => {

        const totalClaims =
            claimsDB.length;

        const highRisk =
            claimsDB.filter(
                c => c.riskLevel === "HIGH"
            ).length;

        const mediumRisk =
            claimsDB.filter(
                c => c.riskLevel === "MEDIUM"
            ).length;

        const lowRisk =
            claimsDB.filter(
                c => c.riskLevel === "LOW"
            ).length;

        res.json({
            totalClaims,
            highRisk,
            mediumRisk,
            lowRisk
        });
    }
);

/*
========================================
HEALTH CHECK
========================================
*/

app.get(
    "/health",
    (_req, res) => {


       
        res.json({
            status: "UP",
            application:
                "Insurance Fraud Detection API"
        });
    }
);

app.get("/claims/:claimId", (req, res) => {
 
    const claim = claims.find(
        c => c.claimId === req.params.claimId
    );
 
    if (!claim) {
        return res.status(404).json({
            message: "Claim not found"
        });
    }
 
    res.json(claim);
});

/*
========================================
SERVER START
========================================
*/

app.listen(PORT, () => {
    console.log(
        `Fraud API running on port ${PORT}`
    );
});