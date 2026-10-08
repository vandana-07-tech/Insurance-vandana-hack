const express = require("express");
 
const app = express();
 
app.use(express.json());
 
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
 
app.listen(3000, () => {
    console.log(
        "Insurance API running on http://localhost:3000"
    );
});