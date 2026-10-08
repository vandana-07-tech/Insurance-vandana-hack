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