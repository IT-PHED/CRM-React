/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./apiClient";

/**
 * Complaints
 * @returns{promise<any>}
 */
export const CreateComplaint = async (payload, token) =>
  await apiClient<any>("POST", "complaint", payload, token);
export const GetComplaintInformationById = async (id: string, token: string) =>
  await apiClient<IGetComplaintInfoResponse>(
    "GET",
    `complaint/ticket/${id}`,
    null,
    token
  );
export const GetDepartmentComplaints = async (deptId: string, token: string) =>
  await apiClient<IDeptTicketApiResponse>(
    "GET",
    `complaint/department/${deptId}?pageNumber=1&PageSize=1000`,
    null,
    token
  );
export const QueryDepartmentComplaints = async (
  deptId: string,
  searchTerm: string = "",
  pageNumber: number = 1,
  pageSize: number = 2000,
  dateFrom?: string,
  dateTo?: string
) => {
  const params = new URLSearchParams({
    departmentId: deptId,
    searchTerm: searchTerm,
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  // Only append date parameters if they have values
  if (dateFrom) params.append("dateFrom", dateFrom);
  if (dateTo) params.append("dateTo", dateTo);

  return await apiClient<IDeptTicketApiResponse>(
    "GET",
    `complaint/query-department?${params.toString()}`
  );
};

export const ReassignComplaint = async (payload: any, token: string) =>
  await apiClient<any>("PATCH", "complaint/reassign", payload, token);
/**
 * Employees
 * @returns{promise<any>}
 */
export const GetRegionalDepartmentMembers = async (
  deptId: string,
  accountNumber: string
) =>
  await apiClient<IRegionalDeptMemberResponse>(
    "GET",
    `employees/regional-department-member?DepartmentId=${deptId}&AccountNumber=${accountNumber}`
  );
export const GetRegions = async () =>
  await apiClient<IRegionsResponse>("GET", `employees/regions`);

/**
 * Dashboard
 * @returns{promise<any>}
 */
export const GetCrmMonthlyStat = async (deptId: string, regionId?: string) => {
  const params = new URLSearchParams({
    departmentId: deptId,
  });

  if (regionId) {
    params.append("regionId", regionId);
  }

  return await apiClient<IMonthlyStatResponse>(
    "GET",
    `dashboard/crm-reports/monthly-stat?${params.toString()}`
  );
};

/**
 * Complaints Resolution
 * @returns{promise<any>}
 */
export const CloseComplaint = async (
  payload: any,
  token: string,
  complaintId: string
) =>
  await apiClient<any>(
    "PATCH",
    `complaint-resolution/close-complaint/${complaintId}`,
    payload,
    token
  );
export const ResolveComplaint = async (
  payload: any,
  token: string,
  complaintId: string
) =>
  await apiClient<any>(
    "PATCH",
    `complaint-resolution/resolve-complaint/${complaintId}`,
    payload,
    token
  );
