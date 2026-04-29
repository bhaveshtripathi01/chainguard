// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AuditStorage {

    // Data structure for one audit report
    struct AuditReport {
        string auditHash;
        address auditor;
        uint256 timestamp;
        string contractName;
    }

    // Store all audits (like a JavaScript object/hashmap)
    mapping(string => AuditReport) private audits;
    string[] private auditIds;

    // Event (like a notification recorded on blockchain)
    event AuditStored(
        string auditId,
        string auditHash,
        address auditor,
        uint256 timestamp
    );

    // WRITE function — stores audit on blockchain (costs gas)
    function storeAudit(
        string memory auditId,
        string memory auditHash,
        string memory contractName
    ) public {
        audits[auditId] = AuditReport({
            auditHash: auditHash,
            auditor: msg.sender,
            timestamp: block.timestamp,
            contractName: contractName
        });

        auditIds.push(auditId);

        emit AuditStored(auditId, auditHash, msg.sender, block.timestamp);
    }

    // READ function — gets audit from blockchain (free, no gas)
    function getAudit(string memory auditId)
        public
        view
        returns (AuditReport memory)
    {
        return audits[auditId];
    }

    // READ function — total number of audits stored
    function getTotalAudits() public view returns (uint256) {
        return auditIds.length;
    }
}