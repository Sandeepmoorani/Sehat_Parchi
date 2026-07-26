export type Language = 'English' | 'Urdu Roman' | 'اردو' | 'سنڌي';

export interface TestValue {
  parameter: string;
  yourValue: string;
  normalRange: string;
  status: 'Low' | 'High' | 'Normal';
  simpleMeaning?: string;
}

export interface AnalysisResult {
  testName: string;
  summary: string;
  values: TestValue[];
  simpleExplanation: string;
  dietTips: string[];
  whenToSeeDoctor: string;
  disclaimer: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  testName: string;
  language: Language;
  data: AnalysisResult;
  image?: string;
}
