export const mockCustomer = {
  name: "Rajesh Kumar Sharma",
  accountNumber: "ACC-2024-78451",
  meterNumber: "MTR-DL-90234",
  category: "Domestic",
  status: "Active" as const,
  activationDate: "2019-03-15",
  phone: "+91 98765 43210",
  email: "rajesh.sharma@email.com",
  city: "New Delhi",
  district: "South Delhi",
  ward: "Ward 12 - Saket",
  pinCode: "110017",
  address: "B-42, Second Floor, Saket Residential Complex, Near Metro Station, New Delhi",
  supplyType: "LT Supply",
  supplyLevel: "230V / 415V",
  loadKW: 5,
  loadKVA: 6.25,
  phase: "Single Phase",
  tariffCode: "DSOP-II",
  transformerCode: "DTR-SDH-0045",
  feederCode: "FDR-SKT-11",
};

export const mockBillingHistory = [
  { id: 1, billNo: "BL-2024-1201", period: "Dec 2024", units: 320, amount: 2450, dueDate: "2025-01-15", status: "Paid" as const },
  { id: 2, billNo: "BL-2024-1101", period: "Nov 2024", units: 290, amount: 2210, dueDate: "2024-12-15", status: "Paid" as const },
  { id: 3, billNo: "BL-2024-1001", period: "Oct 2024", units: 410, amount: 3180, dueDate: "2024-11-15", status: "Pending" as const },
  { id: 4, billNo: "BL-2024-0901", period: "Sep 2024", units: 380, amount: 2940, dueDate: "2024-10-15", status: "Paid" as const },
  { id: 5, billNo: "BL-2024-0801", period: "Aug 2024", units: 450, amount: 3520, dueDate: "2024-09-15", status: "Paid" as const },
  { id: 6, billNo: "BL-2024-0701", period: "Jul 2024", units: 470, amount: 3680, dueDate: "2024-08-15", status: "Paid" as const },
];

export const mockPaymentHistory = [
  { id: 1, receiptNo: "RCP-20250110", date: "2025-01-10", amount: 2450, mode: "Online", status: "Success" as const },
  { id: 2, receiptNo: "RCP-20241208", date: "2024-12-08", amount: 2210, mode: "UPI", status: "Success" as const },
  { id: 3, receiptNo: "RCP-20241015", date: "2024-10-15", amount: 2940, mode: "Cash", status: "Success" as const },
  { id: 4, receiptNo: "RCP-20240912", date: "2024-09-12", amount: 3520, mode: "Online", status: "Failed" as const },
  { id: 5, receiptNo: "RCP-20240913", date: "2024-09-13", amount: 3520, mode: "UPI", status: "Success" as const },
];

export const mockIncidents = [
  { id: 1, ticketNo: "INC-20241218", date: "2024-12-18", reason: "Voltage Fluctuation", status: "Resolved" as const, resolvedDate: "2024-12-20" },
  { id: 2, ticketNo: "INC-20241105", date: "2024-11-05", reason: "Meter Not Working", status: "Resolved" as const, resolvedDate: "2024-11-08" },
  { id: 3, ticketNo: "INC-20241001", date: "2024-10-01", reason: "Power Outage", status: "Open" as const, resolvedDate: null },
];

export const mockTransformerInfo = {
  code: "DTR-SDH-0045",
  capacity: "250 kVA",
  location: "Saket, Sector 4",
  feeders: 4,
  connectedLoad: 180,
  status: "Operational" as const,
  lastMaintenance: "2024-08-22",
};

export const mockMeterInfo = {
  meterNo: "MTR-DL-90234",
  make: "L&T",
  type: "Electronic",
  phase: "Single Phase",
  mf: 1,
  installDate: "2019-03-15",
  lastReading: 12450,
  lastReadingDate: "2024-12-28",
  status: "Working" as const,
};

export const mockConsumptionData = [
  { month: "Jul", kWh: 470, amount: 3680, peak: 280, offPeak: 190 },
  { month: "Aug", kWh: 450, amount: 3520, peak: 270, offPeak: 180 },
  { month: "Sep", kWh: 380, amount: 2940, peak: 220, offPeak: 160 },
  { month: "Oct", kWh: 410, amount: 3180, peak: 240, offPeak: 170 },
  { month: "Nov", kWh: 290, amount: 2210, peak: 160, offPeak: 130 },
  { month: "Dec", kWh: 320, amount: 2450, peak: 180, offPeak: 140 },
];
