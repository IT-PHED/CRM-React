interface IComplaintTicket {
  id: string; // UUID format
  ticket: string;
  dateGenerated: string; // ISO 8601 format: "2025-12-22T16:27:37"
  dateResolved: string | null;
  isResolved: boolean;
  status: string; // e.g., "Approved"

  consumerId: string;
  consumerNumber: string | null;
  consumerName: string;
  consumerAddress: string;
  consumerCategory: string; // e.g., "R2"
  consumerPhoneNumber: string | null;

  complaintTypeId: string; // e.g., "B4"
  complaintType: string; // e.g., "METER"
  complaintSubTypeId: string; // e.g., "BS64"
  complaintSubType: string; // e.g., "Meter- Running Fast"

  remark: string;
  mediaURL: string; // Note: Contains trailing spaces in source data
  correctMeterReading: number;
  source: string; // e.g., "2" (numeric string)
  slaLevel: string | null;

  email: string;
  mobileNo: string | null;
  telephoneNo: string | null;

  meterNo: string;
  maxDemand: string; // e.g., "NonMD"
  routeNumber: string;
  ibc: string;
  bsc: string;

  address1: string;
  address2: string;
  address3: string | null;

  assignedTo: string | null;
  groupId: string | null;
  resolvedBy: string | null; // User ID string
  feedback: string | null;

  closedBy: string | null;
  closedByRemark: string | null;
  closedDate: string | null; // ISO 8601

  createdBy: string; // User ID string
  createdDate: string; // ISO 8601
  modifiedBy: string | null; // User ID string
  modifiedDate: string | null; // ISO 8601
  regionId: string | null;
}

interface IAppResponseWrapper<T> {
    status: string;
    code: number;
    message: string;
    data: T;
}

interface IGetComplaintInfoResponse {
    status: string;
    code: number;
    message: string;
    data: IComplaintTicket;
}

interface IEmployee {
    name: string;
    email: string;
    staffId: string;
    groupId: string;
}
interface ITicket {
    id: string;                    // UUID format
    consumerId: string;
    complaintSubtypeId: string;    // e.g., "Meter checking"
    source: string;                // e.g., "Region"
    ticket: string;                // Ticket number
    dateGenerated: string;         // ISO 8601 format
    dateResolved: string | null;   // ISO 8601 or null
    priority: string;              // e.g., "High", "Medium", "Low"
    complaintTypeId: string;       // e.g., "METER"
    remark: string;
    createdBy: string;             // User ID
    createdDate: string;           // ISO 8601 format
    modifiedBy: string | null;     // User ID or null
    modifiedDate: string | null;   // ISO 8601 or null
    status: string;                // e.g., "New", "Approved", "Resolved"

    // Consumer details
    name: string;                  // Consumer name
    meterNo: string;
    telephoneNo: string;
    maxDemand: string;             // e.g., "MD", "NonMD"
    category: string;              // e.g., "C2", "R2"

    // Address details
    address1: string;
    address2: string;
    address3: string;

    // Location codes
    ibc: string;
    bsc: string;
    routeNumber: string;

    // Contact details
    email: string;
    mobileNo: string;

    // Meter details
    type: string;                  // e.g., "POSTPAID", "PREPAID"
    dtr: string | null;
    purpose: string | null;
    meterDigit: string;            // Numeric string
    meterMake: string | null;

    // Flags
    smsFlag: number;               // 0 or 1
    emailFlag: number;             // 0 or 1

    // Region details
    regionId: string;
    adviceType: string | null;
    cdeskId: number;
    sla_Level: string;             // Numeric string
    region_Id: string | null;
    group_Id: string | null;
    region: string;                // e.g., "Alpha 2"
}

type IDeptTicketApiResponse = IAppResponseWrapper<{
    data: ITicket[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
}>;

type IRegionalDeptMemberResponse = IAppResponseWrapper<IEmployee[]>;

type IMonthlyStatResponse = IAppResponseWrapper<{
    total: number;
    unresolved: number;
    resolved: number;
    overdue: number;
    today: number;
}>;

type IRegionsResponse = IAppResponseWrapper<{
    id: string;
    region: string;
}[]>;