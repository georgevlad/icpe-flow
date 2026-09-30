export type Stage = 'change' | 'implementation' | 'testing' | 'remediation' | 'retesting' | 'preparation' | 'delivered';
export type Action = 'accept-change' | 'implement' | 'run-test' | 'remediate' | 'retest' | 'attach-test' | 'attach-manual' | 'handover';
export interface DemoState {
  schemaVersion: 1;
  stage: Stage;
  revision: 1 | 2;
  observation: null | { id: string; status: 'open' | 'awaiting-retest' | 'closed' };
  attachments: { test: boolean; manualRevision: 1 | 2 };
  history: { id: string; action: string; title: string; detail: string; at: string }[];
  deliveredPackage: null | { id: string; at: string; documents: { code: string; revision: string }[] };
}
export interface DocumentData {
  id: string; code: string; title: string; revision: string; status: string; lead: string;
  sections: { title: string; body?: string; headers?: string[]; rows?: string[][] }[];
}
