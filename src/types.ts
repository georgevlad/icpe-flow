export type Stage = 'change' | 'implementation' | 'testing' | 'remediation' | 'retesting' | 'preparation' | 'delivered';
export type Action = 'accept-change' | 'implement' | 'run-test' | 'remediate' | 'retest' | 'attach-test' | 'attach-manual' | 'handover';
export type ServiceAction = 'service-classify' | 'service-schedule' | 'service-record-visit' | 'service-verify' | 'service-close';
export type ServiceStage = 'reported' | 'classified' | 'scheduled' | 'verification' | 'confirmation' | 'closed';
export type OfferAction = 'offer-review' | 'offer-clarify' | 'offer-draft' | 'offer-feedback' | 'offer-revise' | 'offer-accept' | 'offer-start';
export type OfferStage = 'received' | 'clarification' | 'draft' | 'feedback' | 'revision' | 'acceptance' | 'handoff' | 'started';
export type LabAction = 'lab-plan' | 'lab-collect' | 'lab-receive' | 'lab-analyze' | 'lab-review' | 'lab-issue';
export type LabStage = 'requested' | 'planned' | 'collected' | 'received' | 'review' | 'ready' | 'issued';
export interface LabCase {
  id: string;
  stage: LabStage;
  plannedAt: string | null;
  sample: null | { id: string; at: string; collectedBy: string; source: string };
  receipt: null | { at: string; receivedBy: string; note: string };
  analysis: null | { at: string; analyst: string; results: { indicator: string; value: string; unit: string }[] };
  review: null | { at: string; reviewedBy: string; note: string };
  report: null | { id: string; revision: '01'; at: string; recipient: string; sampleId: string; results: { indicator: string; value: string; unit: string }[] };
  history: { id: string; action: string; title: string; detail: string; at: string }[];
}
export interface OfferCase {
  id: string;
  stage: OfferStage;
  reviewedAt: string | null;
  clarification: null | { at: string; received: string; openPoint: string };
  versions: { id: string; revision: '01' | '02'; at: string; amountLei: number; scope: string[]; assumptions: string[] }[];
  feedback: null | { at: string; request: string };
  accepted: null | { revision: '02'; at: string; by: string };
  project: null | { id: string; at: string; coordinator: string; acceptedOfferRevision: '02'; handoffItems: string[]; openPoint: string };
  history: { id: string; action: string; title: string; detail: string; at: string }[];
}
export interface ServiceCase {
  id: string;
  stage: ServiceStage;
  assignee: string | null;
  scheduledAt: string | null;
  intervention: null | { at: string; finding: string; action: string; evidence: string };
  verification: null | { at: string; by: string; result: string };
  clientConfirmation: null | { at: string; note: string };
  history: { id: string; action: string; title: string; detail: string; at: string }[];
}
export interface DemoState {
  schemaVersion: 4;
  stage: Stage;
  revision: 1 | 2;
  observation: null | { id: string; status: 'open' | 'awaiting-retest' | 'closed' };
  attachments: { test: boolean; manualRevision: 1 | 2 };
  history: { id: string; action: string; title: string; detail: string; at: string }[];
  deliveredPackage: null | { id: string; at: string; documents: { code: string; revision: string }[] };
  service: ServiceCase;
  offer: OfferCase;
  lab: LabCase;
}
export interface DocumentData {
  id: string; code: string; title: string; revision: string; status: string; lead: string;
  sections: { title: string; body?: string; headers?: string[]; rows?: string[][] }[];
}
