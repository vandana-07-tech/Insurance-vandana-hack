# Postman Claim Fraud Test Cases

## Request Setup

- Method: `POST`
- URL: `http://localhost:3000/claims`
- Header: `Content-Type: application/json`
- Expected submission status: `201 Created`

The expected responses below follow the API response shape `{ "claimId": "...", "status": "...", "fraudRule": "..." }`.

## TC-001: Claim Exceeds Policy Limit (RULE-001)

**Request JSON**

```json
{
  "claimId": "CLM1002",
  "policyId": "POL1002",
  "customerId": "CUS1002",
  "claimAmount": 150000,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `201`

**Expected response**

```json
{
  "claimId": "CLM1002",
  "status": "FLAGGED",
  "fraudRule": "RULE-001"
}
```

**Postman Tests**

```javascript
pm.test("Claim is flagged by RULE-001", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM1002",
    status: "FLAGGED",
    fraudRule: "RULE-001"
  });
});
```

## TC-002: Policy Expired (RULE-002)

**Request JSON**

```json
{
  "claimId": "CLM1003",
  "policyId": "POL1003",
  "customerId": "CUS1003",
  "claimAmount": 50000,
  "policyLimit": 100000,
  "policyStatus": "EXPIRED",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `201`

**Expected response**

```json
{
  "claimId": "CLM1003",
  "status": "FLAGGED",
  "fraudRule": "RULE-002"
}
```

**Postman Tests**

```javascript
pm.test("Claim is flagged by RULE-002", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM1003",
    status: "FLAGGED",
    fraudRule: "RULE-002"
  });
});
```

## TC-003: Duplicate Claim ID (RULE-003)

**Setup:** Start with a fresh API process. Submit the request JSON once as a baseline; submit the same JSON again as the test request. The API must retain claims between these two requests.

**Request JSON (submit a second time)**

```json
{
  "claimId": "CLM1004",
  "policyId": "POL1004",
  "customerId": "CUS1004",
  "claimAmount": 50000,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `201`

**Expected response to the second submission**

```json
{
  "claimId": "CLM1004",
  "status": "FLAGGED",
  "fraudRule": "RULE-003"
}
```

**Postman Tests**

```javascript
pm.test("Repeated claim is flagged by RULE-003", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM1004",
    status: "FLAGGED",
    fraudRule: "RULE-003"
  });
});
```

## TC-004: Incident Outside Policy Period (RULE-004)

This case assumes `policyStartDate` and `policyEndDate` are inclusive policy bounds.

**Request JSON**

```json
{
  "claimId": "CLM1005",
  "policyId": "POL1005",
  "customerId": "CUS1005",
  "claimAmount": 50000,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "policyStartDate": "2026-09-01",
  "policyEndDate": "2026-09-30",
  "incidentDate": "2026-08-31"
}
```

**Expected HTTP status:** `201`

**Expected response**

```json
{
  "claimId": "CLM1005",
  "status": "FLAGGED",
  "fraudRule": "RULE-004"
}
```

**Postman Tests**

```javascript
pm.test("Out-of-period incident is flagged by RULE-004", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM1005",
    status: "FLAGGED",
    fraudRule: "RULE-004"
  });
});
```

## Missing Boundary Scenarios

- **Claim amount boundaries:** Detailed Postman cases for below, equal to, and above the limit, zero, negative, null, and a very large value are included below.
- **Policy-period edges:** Test an incident exactly on `policyStartDate` and `policyEndDate`, plus one day before the start and one day after the end. Confirm the endpoint inclusivity rule.
- **Rule separation:** Test an expired policy with an in-period incident and an active policy with an out-of-period incident to distinguish RULE-002 from RULE-004.
- **Duplicate definition:** Test the same `claimId` twice, and separately test matching claim details with a different ID. The rules file does not define duplicate matching criteria.
- **Multiple matching rules:** Submit a claim that exceeds the limit and has an expired policy. Define expected rule precedence; the current implementation overwrites RULE-001 with RULE-002.
- **Other invalid input:** Missing or malformed amounts, missing/invalid dates, and unknown policy status still need coverage. Neither data file defines validation behavior.

## Claim Amount Boundary Postman Cases

The cases below use a policy limit of `100000` and an active policy to isolate RULE-001. They assume zero is accepted because the stated rule only sets an upper bound. Negative and null amounts are treated as invalid input and expected to return `400`; the error body below is a proposed contract because the current API does not validate these values.

### TC-AMT-001: Amount One Below Policy Limit

**Request JSON**

```json
{
  "claimId": "CLM-AMT-001",
  "policyId": "POL-AMT-001",
  "customerId": "CUS-AMT-001",
  "claimAmount": 99999,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `201`

**Expected response**

```json
{
  "claimId": "CLM-AMT-001",
  "status": "ACCEPTED",
  "fraudRule": null
}
```

**Postman Tests**

```javascript
pm.test("Amount one below limit is accepted", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM-AMT-001",
    status: "ACCEPTED",
    fraudRule: null
  });
});
```

### TC-AMT-002: Amount Exactly at Policy Limit

**Request JSON**

```json
{
  "claimId": "CLM-AMT-002",
  "policyId": "POL-AMT-002",
  "customerId": "CUS-AMT-002",
  "claimAmount": 100000,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `201`

**Expected response**

```json
{
  "claimId": "CLM-AMT-002",
  "status": "ACCEPTED",
  "fraudRule": null
}
```

**Postman Tests**

```javascript
pm.test("Amount equal to limit is accepted", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM-AMT-002",
    status: "ACCEPTED",
    fraudRule: null
  });
});
```

### TC-AMT-003: Amount One Above Policy Limit

**Request JSON**

```json
{
  "claimId": "CLM-AMT-003",
  "policyId": "POL-AMT-003",
  "customerId": "CUS-AMT-003",
  "claimAmount": 100001,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `201`

**Expected response**

```json
{
  "claimId": "CLM-AMT-003",
  "status": "FLAGGED",
  "fraudRule": "RULE-001"
}
```

**Postman Tests**

```javascript
pm.test("Amount one above limit is flagged by RULE-001", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM-AMT-003",
    status: "FLAGGED",
    fraudRule: "RULE-001"
  });
});
```

### TC-AMT-004: Zero Claim Amount

**Request JSON**

```json
{
  "claimId": "CLM-AMT-004",
  "policyId": "POL-AMT-004",
  "customerId": "CUS-AMT-004",
  "claimAmount": 0,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `201`

**Expected response**

```json
{
  "claimId": "CLM-AMT-004",
  "status": "ACCEPTED",
  "fraudRule": null
}
```

**Postman Tests**

```javascript
pm.test("Zero amount does not exceed policy limit", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM-AMT-004",
    status: "ACCEPTED",
    fraudRule: null
  });
});
```

### TC-AMT-005: Negative Claim Amount

**Request JSON**

```json
{
  "claimId": "CLM-AMT-005",
  "policyId": "POL-AMT-005",
  "customerId": "CUS-AMT-005",
  "claimAmount": -1,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `400` (proposed validation behavior)

**Expected response**

```json
{
  "message": "claimAmount must be a non-negative number"
}
```

**Postman Tests**

```javascript
pm.test("Negative amount is rejected", function () {
  pm.response.to.have.status(400);
  pm.expect(pm.response.json()).to.deep.equal({
    message: "claimAmount must be a non-negative number"
  });
});
```

### TC-AMT-006: Null Claim Amount

**Request JSON**

```json
{
  "claimId": "CLM-AMT-006",
  "policyId": "POL-AMT-006",
  "customerId": "CUS-AMT-006",
  "claimAmount": null,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `400` (proposed validation behavior)

**Expected response**

```json
{
  "message": "claimAmount must be a non-negative number"
}
```

**Postman Tests**

```javascript
pm.test("Null amount is rejected", function () {
  pm.response.to.have.status(400);
  pm.expect(pm.response.json()).to.deep.equal({
    message: "claimAmount must be a non-negative number"
  });
});
```

### TC-AMT-007: Very Large Claim Amount

**Request JSON**

```json
{
  "claimId": "CLM-AMT-007",
  "policyId": "POL-AMT-007",
  "customerId": "CUS-AMT-007",
  "claimAmount": 1e308,
  "policyLimit": 100000,
  "policyStatus": "ACTIVE",
  "incidentDate": "2026-09-15"
}
```

**Expected HTTP status:** `201`

**Expected response**

```json
{
  "claimId": "CLM-AMT-007",
  "status": "FLAGGED",
  "fraudRule": "RULE-001"
}
```

**Postman Tests**

```javascript
pm.test("Very large amount is flagged by RULE-001", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "CLM-AMT-007",
    status: "FLAGGED",
    fraudRule: "RULE-001"
  });
});
```

## Implementation Note

The current `server.js` implements RULE-001 and RULE-002 only. RULE-003 and RULE-004 are expected-behavior tests and will not pass until duplicate detection and policy-period validation are implemented. The in-memory claims store also starts empty and does not load `test-data/claims.json`.