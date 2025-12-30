export type DailyReport = {
  dailyReportId: number | null;
  date: string;
  foreman?: string;
  userName?: string;
  description: string;
  manOther: string;
  equipmentOther: string;
  issues: string;
  employees: DREmployee[];
  equipments: DREquipment[];
  rentals: DRRental[];
  tools: DRTool[];
  dumpsters: DrDumpster[];
};

export type Employee = {
  employeesId: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  title: string;
};

export type Equipment = {
  equipmentsId: number;
  family: string;
  number: string;
  name: string;
  manufacturing: string;
  model: string;
  year: string;
  purchaseDate: string;
  status: string;
  condition: string;
  serialNumber: string;
  hour: string;
};

export type Attachment = {
  attachmentsId: number;
  family: string;
  number: string;
  name: string;
  manufacturing: string;
  model: string;
  year: string;
  purchaseDate: string;
  status: string;
  condition: string;
  serialNumber: string;
};

export type Attachments = {
  // pending
};

export type Photos = {};

export type Tools = {};

export type Dumpsters = {};

export type Job = {
  jobsId: number | null;
  number: string;
  type: string;
  name: string;
  address: string;
  contractor: string;
  contact: string;
  status: string;
};

export type DREmployee = {
  drEmployeesId?: number | null;
  dailyReportId: number | null;
  employeesId: number | null;
  inHour: string;
  outHour: string;
  lunch: boolean;
  ppe: boolean;
  comment: string;
};

export type DREquipment = {
  drEquipmentsId: number | null;
  dailyReportId: number | null;
  equipmentsId: number;
  employeesId: number | null;
  type: string;
  initialHour: string;
  newHour: string;
};

export type DRRental = {
  temporalId: string;
  drRentalsId: number | null;
  dailyReportId: number | null;
  employeesId: number | null;
  equipmentType: string;
  equipmentName: string;
  company: string;
  equipmentNumber: string;
  odometer: number;
};

export type DRTool = {
  temporalId: string;
  drToolId: number | null;
  dailyReportId: number | null;
  qty: number;
  name: string;
  other: string;
  comments: string;
};

export type DumpsterTable = {
  type: string;
  size: string;
  concrete: number;
  metal: number;
  cd: number;
};

export type DrDumpster = {
  drDumpstersId: number | null;
  sourceDumpster: string;
  sizeDumpster: string;
  typeDumpster: String;
  quantity: number;
};

export type DrResources = {
  employees: DREmployee[];
  equipments: DREquipment[];
  rentals: DRRental[];
  tools: DRTool[];
};

export type DrTotals = {
  days: number;
  hours: string;
};
