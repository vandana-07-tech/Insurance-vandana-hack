# Req2 Claim API Test Plan

## Scope

Supported routes only:

- `POST {{baseUrl}}/claims`, header `Content-Type: application/json`, expected creation status `201`.
- `GET {{baseUrl}}/claims/{{claimId}}`, no request body; successful retrieval returns the stored raw request with `200`, and an unknown ID returns `404` with `{ "message": "Claim not found" }`.

No authorization header is implemented or required by this mock. Start with a fresh API process when test isolation matters; claims are stored in memory and are lost on restart.

Run the executable collection with Newman 6.2.2 after starting the API on port 3000:

```powershell
npm test
```

The collection performs 9 requests and assertions across 8 scenario IDs; CLM-006 is submitted twice to characterize duplicate handling.

## POST Scenarios

For all POST cases, use the route and header above. Expected response shape is `{ "claimId": string, "status": "ACCEPTED" | "FLAGGED", "fraudRule": string | null }`.

### CLM-001: Baseline, active policy (contract)

Request body:

```json
{
  "claimId": "SYN-CLM-001",
  "policyNumber": "POL-SYN-001",
  "customerId": "CUS-SYN-001",
  "vehicleNumber": "VEH-SYN-001",
  "accidentDate": "2026-09-15",
  "claimAmount": 2500,
  "claimType": "COLLISION",
  "policyLimit": 10000,
  "policyStatus": "ACTIVE"
}
```

Expected: `201`; `{ "claimId": "SYN-CLM-001", "status": "ACCEPTED", "fraudRule": null }`.

```javascript
pm.test("CLM-001 accepted under active policy", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "SYN-CLM-001",
    status: "ACCEPTED",
    fraudRule: null
  });
});
```

### CLM-002: Amount exceeds limit (contract)

Request body:

```json
{
  "claimId": "SYN-CLM-002",
  "policyNumber": "POL-SYN-002",
  "customerId": "CUS-SYN-002",
  "vehicleNumber": "VEH-SYN-002",
  "accidentDate": "2026-09-15",
  "claimAmount": 12000,
  "claimType": "COLLISION",
  "policyLimit": 10000,
  "policyStatus": "ACTIVE"
}
```

Expected: `201`; status `FLAGGED`, `fraudRule` `RULE-001`.

```javascript
pm.test("CLM-002 flagged for amount over limit", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "SYN-CLM-002",
    status: "FLAGGED",
    fraudRule: "RULE-001"
  });
});
```

### CLM-003: Expired policy (contract)

Request body:

```json
{
  "claimId": "SYN-CLM-003",
  "policyNumber": "POL-SYN-003",
  "customerId": "CUS-SYN-003",
  "vehicleNumber": "VEH-SYN-003",
  "accidentDate": "2026-09-15",
  "claimAmount": 2500,
  "claimType": "COLLISION",
  "policyLimit": 10000,
  "policyStatus": "EXPIRED"
}
```

Expected: `201`; status `FLAGGED`, `fraudRule` `RULE-002`.

```javascript
pm.test("CLM-003 flagged for expired policy", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "SYN-CLM-003",
    status: "FLAGGED",
    fraudRule: "RULE-002"
  });
});
```

### CLM-004: Both amount over limit and expired (precedence TBD; characterization)

Request body:

```json
{
  "claimId": "SYN-CLM-004",
  "policyNumber": "POL-SYN-004",
  "customerId": "CUS-SYN-004",
  "vehicleNumber": "VEH-SYN-004",
  "accidentDate": "2026-09-15",
  "claimAmount": 12000,
  "claimType": "COLLISION",
  "policyLimit": 10000,
  "policyStatus": "EXPIRED"
}
```

Expected current behavior: `201`, status `FLAGGED`, `fraudRule` `RULE-002` (the expired-policy check runs after and overwrites RULE-001). Business precedence is unresolved; do not treat this observed result as an approved contract.

```javascript
pm.test("CLM-004 characterizes current rule precedence", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "SYN-CLM-004",
    status: "FLAGGED",
    fraudRule: "RULE-002"
  });
});
```

### CLM-005: Omit customer and incident details (required-field contract TBD; characterization)

Request body:

```json
{
  "claimId": "SYN-CLM-005",
  "policyNumber": "POL-SYN-005",
  "policyLimit": 10000,
  "policyStatus": "ACTIVE"
}
```

Expected current behavior: `201`, status `ACCEPTED`, `fraudRule` `null`; the mock performs no required-field validation and stores this raw body. Whether omitted fields should be rejected is unresolved.

```javascript
pm.test("CLM-005 characterizes omitted-field handling", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "SYN-CLM-005",
    status: "ACCEPTED",
    fraudRule: null
  });
});
```

### CLM-006: Submit the same claim ID twice (duplicate contract TBD; characterization)

Submit this exact body twice, sequentially, in the same API process:

```json
{
  "claimId": "SYN-CLM-006",
  "policyNumber": "POL-SYN-006",
  "customerId": "CUS-SYN-006",
  "vehicleNumber": "VEH-SYN-006",
  "accidentDate": "2026-09-15",
  "claimAmount": 2500,
  "claimType": "COLLISION",
  "policyLimit": 10000,
  "policyStatus": "ACTIVE"
}
```

Expected current behavior for each POST: `201`, `{ "claimId": "SYN-CLM-006", "status": "ACCEPTED", "fraudRule": null }`. The mock does not detect duplicates. Duplicate rejection/flagging and its status/body remain an unresolved contract.

```javascript
pm.test("CLM-006 characterizes duplicate submission", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "SYN-CLM-006",
    status: "ACCEPTED",
    fraudRule: null
  });
});
```

## GET Scenarios

### CLM-016: Retrieve created claim (contract)

Prerequisite: create CLM-001 in the same API process. Send `GET {{baseUrl}}/claims/SYN-CLM-001` with no body. Expected: `200` and the exact stored request body.

```javascript
pm.test("CLM-016 returns the stored raw claim", function () {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json()).to.deep.equal({
    claimId: "SYN-CLM-001",
    policyNumber: "POL-SYN-001",
    customerId: "CUS-SYN-001",
    vehicleNumber: "VEH-SYN-001",
    accidentDate: "2026-09-15",
    claimAmount: 2500,
    claimType: "COLLISION",
    policyLimit: 10000,
    policyStatus: "ACTIVE"
  });
});
```

### CLM-017: Retrieve unknown claim (contract / negative)

Send `GET {{baseUrl}}/claims/SYN-CLM-017` with no body. Expected: `404` and `{ "message": "Claim not found" }`.

```javascript
pm.test("CLM-017 returns not found for missing claim", function () {
  pm.response.to.have.status(404);
  pm.expect(pm.response.json()).to.deep.equal({
    message: "Claim not found"
  });
});
```

## Req2 Coverage Blocked by Missing Routes

Claim modification, approval, rejection, closure, status transitions, policy coverage application, payouts, and settlements cannot be tested against this implementation: no routes implement those operations. Do not represent them as passing API tests until corresponding endpoints and response contracts exist.