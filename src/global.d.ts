interface IComplaintTicket {
  id: string; // UUID format
  ticket: string;
  dateGenerated: string; // ISO 8601 format: "2025-12-22T16:27:37"
  dateResolved: string | null;
  isResolved: boolean;
  status: string; // e.g., "Allocated"

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
    status: string;                // e.g., "New", "Allocated", "Resolved"

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

type AccountCountResponse = IAppResponseWrapper<number>;

interface ICustomerProfile {
    IBC_NAME: string;
    BSC_NAME: string;
    STATUS: 'Active' | 'Inactive' | string;
    CON_CONSUMERSTATUS: string;
    CONS_ACC: string;
    MTRNO: string;
    BOOKNO: string;
    POCNO: string;
    ADDRESS: string;
    CONSUMER_NAME: string;
    METERNO: string;
    CONS_TYPE: 'POSTPAID' | 'PREPAID' | string;
    TARIFF: string;
    LOAD: number | null;
    MARKETERNAME: string;
    MARKETERPHONE: string | null;
    ARREAR: number;
    FACTOR_TYPE: string;
    AMOUNT_PAYBLE: number;
    TOTAL_ARREAR: number;
    FACTOR_AMOUNT: number;
    CON_MOBILENO: string;
    EMAIL: string | null;
    REASON: string | null;
    CON_DATE: string;
    CONCHARGEDATE: string | null;
    METERINSTALLDATE: string | null;
    AMOUNTTOSETTLED: number;
    ZONE: string;
    FEEDER33NAME: string;
    FEEDER11NAME: string;
    DTR_NAME: string;
    DTRID: string;
    CIN: string | null;
    SBT_RATE: string;
    SBT_TARIFF: string;
}

interface ILikeAccountResponse {
    conS_ACC: string,
    conS_METERNO: string,
    conS_NAME: string,
    conS_ADDR1: string,
    coN_MOBILENO?: string | null,
    amounttosettled: number,
    conS_TYPE: string
}

type IConsumerProfileResponse = IAppResponseWrapper<ICustomerProfile>;

type IAccountApiLikeResponse = IAppResponseWrapper<{
    value: ILikeAccountResponse[]
}>;
interface IOutstanding {
    ID: number;
    CONSUMERNO: string;
    TOT_AMOUNT: number;
    SETTLEDAMOUNT: number;
    AMOUNTTOSETTLED: number;
    PRIORITY: number;
    PURPOSE: string;
    COMM_DATE: string;
    REASON: string;
    FACTOR_PERCENTAGE: number;
    FIXED_AMOUNT: number;
    CREATEDBY: string;
    CREATEDON: string;
    MODIFIEDBY: string | null;
    MODIFIEDON: string | null;
}

interface ISystemRecord {
    IBC_NAME: string;
    BSC_NAME: string;
    CONSUMER_NAME: string;
    CONSUMER_TYPE: 'PREPAID' | 'POSTPAID' | string;
    METER_NO: string;
    AMOUNT: number;
    PURPOSE: string;
}

interface IBasicInfo {
    IBC_NAME: string;
    BSC_NAME: string;
    CONS_ACC: string;
    CONSUMER_NAME: string;
    METER_NO: string;
    CONS_TYPE: 'PREPAID' | 'POSTPAID' | string;
    TARIFF: string;
    LOAD: number;
    ARREAR: number;
}

interface ICustomerPaymentHistory {
    CONSUMER_NAME: string;
    CONSUMER_TYPE: ConsumerType;
    METER_NO: string;
    TOKEN_NO: string | null;
    AMOUNT: number;
    HANDLED_BY: string | null;
    RECEPTNO: string;
    RECEIPTNUMBER: string | null;
    TARIFF: string | null;
    PAYMENTDATETIME: string; // Format: DD-MM-YYYY HH:mm:ss
    UNIT: number | null;
    VENDING_AMOUNT: number | null;
    CANCELLED_STATUS: CancelledStatus | string;
    CANCELLED_BY: string | null;
    CANCEL_DATE: string | null;
}

interface IBasicIncident {
    INCIDENCE: string;              // e.g., "Security Deposit"
    AMOUNTTOSETTLE: number;         // e.g., 10000
    SETTLEDAMOUNT: number;          // e.g., 0
    TOTAL_AMOUNT: number;           // e.g., 10000
    CREATEDDATETIME: string;        // e.g., "2025-12-31T08:40:15"
    INC_DATE: string;               // e.g., "2025-12-31T08:40:15"
}

interface IFeederMapping {
  ACCOUNT_NO: string;
  NAME: string;
  ADDRESS: string;
  STATUS: string;
  PHONE: string;
  METER: string;
  IS_METERED: string;
  PRODUCT_NAME: string;
  CONSUMER_TYPE: string;
  METER_TYPE: string;
  
  // Fields to display in Transformer section
  DTRID: number | null;           // Transformer Code
  DTRNAME: string | null;         // Transformer Name
  KVA: string | null;             // Capacity
  FEEDER11ID: number | null;      // 11kV Feeder ID
  FEEDER11NAME: string | null;    // 11kV Feeder Name
  SUBSTATION_ID: number | null;   // Substation ID
  INJ_NAME: string | null;        // Injection Substation Name
  FEEDER33ID: string | null;      // 33kV Feeder ID
  FEEDER33NAME: string | null;    // 33kV Feeder Name
  TSID: number | null;            // Transmission Station ID
  TS_NAME: string | null;         // Transmission Station Name
  IBC_NAME: string | null;        // IBC Name
  BSC_NAME: string | null;        // BSC Name
  
  // Optional/Nullable fields (not displayed but part of object)
  ZONE?: string | null;
  REGION_ID?: number | null;
  REGION?: string | null;
}

interface IAccountHistoryRecord {
  ID: number;
  BILLMONTH: string;
  BILLDATE: string;
  CURRENT_BILL_AMOUNT: number;
  ARREAR: number;
  PAYMENT: number;
  BALANCE: number;
  BILL_AMOUNT: number;
  READING: number | null;
  CONSUMPTION: number | null;
  KVA: number | null;
  READCODE: string | number | null;
  TARIFF: string | null;
  BILLNO: string | null;
  RECEIPTNUMBER: string | null;
  REMARKS: string | null;
  BALANCE_CALC: number;
}

interface IMonthlyDataPoint {
  MONTH: string;  // ISO 8601 date string: "2025-09-01T00:00:00"
  VALUE: number;
}

type ICustomerInfoTableRespose = IAppResponseWrapper<{
    outstanding: IOutstanding[];
    systemRecords: ISystemRecord[];
    basicInfo: IBasicInfo[];
    paymentHistory: ICustomerPaymentHistory[];
    incidentRecords: IBasicIncident[];
    feederMapping: IFeederMapping | null;
}>;

type IMonthlyConsumptionResponse = IAppResponseWrapper<{
    monthlyConsumption: IMonthlyDataPoint[];
    monthlyPayments: IMonthlyDataPoint[];
}>;

type ICustomerAccountStatementApiResponse = IAppResponseWrapper<IAccountHistoryRecord[]>