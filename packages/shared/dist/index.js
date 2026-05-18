"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentPersona = exports.TaskStatus = exports.EpicStatus = void 0;
var EpicStatus;
(function (EpicStatus) {
    EpicStatus["DRAFT"] = "DRAFT";
    EpicStatus["ARCHITECTING"] = "ARCHITECTING";
    EpicStatus["EXECUTING"] = "EXECUTING";
    EpicStatus["REVIEW"] = "REVIEW";
    EpicStatus["DONE"] = "DONE";
})(EpicStatus || (exports.EpicStatus = EpicStatus = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "PENDING";
    TaskStatus["WRITING_SPECS"] = "WRITING_SPECS";
    TaskStatus["IMPLEMENTING"] = "IMPLEMENTING";
    TaskStatus["TESTING"] = "TESTING";
    TaskStatus["DONE"] = "DONE";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var AgentPersona;
(function (AgentPersona) {
    AgentPersona["UX"] = "UX";
    AgentPersona["ENGINEER"] = "ENGINEER";
    AgentPersona["TESTER"] = "TESTER";
    AgentPersona["REVIEWER"] = "REVIEWER";
    AgentPersona["PRINCIPAL_ARCHITECT"] = "PRINCIPAL_ARCHITECT";
})(AgentPersona || (exports.AgentPersona = AgentPersona = {}));
