/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiService from "../services/apiEndpoints";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

/**
 *
 * COMPLAINT FUNCTIONALITY
 *
 */
import { showSuccess } from "@/utils/alert";
import { useMemo } from "react";

export const useCreateComplaint = (onSuccess?: (message?: string) => void) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: createComplaint,
    isPending,
    data,
    error,
  } = useMutation({
    mutationFn: (payload: any) => apiService.CreateComplaint(payload, token),

    // Wait for user to confirm the alert before continuing
    onSuccess: async (resp: any) => {
      const message = resp?.data || "Complaint created successfully";

      try {
        await showSuccess(message, "Success");
      } catch (e) {
        // ignore modal errors and continue
      }

      queryClient.invalidateQueries({ queryKey: ["complaintInformation"] });
      onSuccess?.(message);
    },

    onError: (err: any) => {
      toast.error(err?.message || "Failed to create Complaint", {
        id: "create-complaint",
      });
    },
  });

  return {
    createComplaint,
    isPending,
    data,
    error,
  };
};

export const useReassignComplaint = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: reassignComplaint,
    isPending,
    data,
    error,
  } = useMutation({
    mutationFn: (payload: any) => apiService.ReassignComplaint(payload, token),

    onSuccess: () => {
      toast.success("Complaint reassigned successfully 🎉", {
        id: "reasign-complaint",
      });

      queryClient.invalidateQueries({ queryKey: ["complaintInformation"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to reassign Complaint", {
        id: "reassign-complaint",
      });
    },
  });

  return {
    reassignComplaint,
    isPending,
    data,
    error,
  };
};

export const GetComplaintInformation = () => {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    data: complaintInfo,
    error,
  } = useQuery({
    queryKey: ["complaintInformation"],
    queryFn: () => apiService.GetComplaintInformationById(id, token as string),
  });

  return { isLoading, complaintInfo, error };
};

export const GetAllDeptComplaintTable = (searchId: string) => {
  const { token, user } = useAuth();

  const {
    isLoading,
    data: allDeptComplaints,
    error,
  } = useQuery({
    queryKey: ["DeptComplaintInfo", user.departmentId, searchId],
    queryFn: () => {
      if (searchId) {
        return apiService.QueryDepartmentComplaints(
          user.departmentId,
          searchId
        );
      }

      return apiService.GetDepartmentComplaints(
        user.departmentId,
        token as string
      );
    },
  });

  return { isLoading, allDeptComplaints, error };
};

export const useGetCrmMonthlyStats = () => {
  const { user } = useAuth();

  const {
    isLoading,
    data: monthlyStats,
    error,
  } = useQuery({
    queryKey: ["crmMonthlyStats"],
    queryFn: () => apiService.GetCrmMonthlyStat(user.departmentId),
  });

  return { isLoading, monthlyStats, error };
};

export const useGetRegions = () => {
  const {
    isLoading,
    data: allRegions,
    error,
  } = useQuery({
    queryKey: ["allRegions"],
    queryFn: () => apiService.GetRegions(),
  });

  return { isLoading, allRegions, error };
};

export const useGetAllRegionalUsersTable = (
  departmentId: string,
  accountNumber: string,
  regionId: string
) => {
  const {
    isLoading,
    data: allRegionalStaffs,
    error,
  } = useQuery({
    queryKey: ["regionalUsers", departmentId, accountNumber, regionId],
    queryFn: () =>
      apiService.GetRegionalDepartmentMembers(
        departmentId,
        accountNumber,
        regionId
      ),
    enabled: !!departmentId && (!!accountNumber || !!regionId), // ← either condition satisfies
  });

  return { isLoading, allRegionalStaffs, error };
};

export const useCloseComplaint = (complaintId: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: closeComplaint,
    isPending,
    data,
    error,
  } = useMutation({
    mutationFn: (payload: any) =>
      apiService.CloseComplaint(payload, token, complaintId),

    onSuccess: () => {
      toast.success("Complaint close successfully 🎉", {
        id: "close-complaint",
      });

      queryClient.invalidateQueries({ queryKey: ["complaintInformation"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to close Complaint", {
        id: "close-complaint",
      });
    },
  });

  return {
    closeComplaint,
    isPending,
    data,
    error,
  };
};

export const useGetCustomerInformation = (customerNo: string, isEnabled: boolean) => {
  const {
    isLoading,
    data: CustomerInformation,
    error,
  } = useQuery({
    queryKey: ["customerInformation", customerNo],
    queryFn: () => apiService.GetCustomerInformation(customerNo),
    enabled: isEnabled,
  });

  return { isLoading, CustomerInformation, error };
};

export const useSearchCustomerInformation = (setMode: (mode: "single" | "multiple" | null) => void, setModalOpen: (open: boolean) => void) => {
  const {
    mutate: countCustomers,
    isPending,
    data,
    error,
  } = useMutation({
    mutationFn: (customerNo: string) => apiService.GetCustomerCount(customerNo),
    onSuccess: (data) => {
      if (data?.data === 0) {
        toast.error("No customer found with that account number", {
          id: "search-customer",
        });
        setMode(null);
      } else if (data?.data === 1) {
        setMode("single");
      } else {
        setMode("multiple");
        setModalOpen(true);
      }
    }
  });

  return { countCustomers, isPending, data, error };
}

export const useGetCustomersLikeAccountNumber = (accountNumber: string, isEnabled: boolean) => {
  const {
    isLoading,
    data: getCustomersLikeAccountNumberResponse,
    error,
  } = useQuery({
    queryKey: ["customersLikeAccountNumber", accountNumber],
    queryFn: () => apiService.GetCustomersLikeAccountNumber(accountNumber),
    enabled: isEnabled,
  });

  return { isLoading, getCustomersLikeAccountNumberResponse, error };
}

export const useGetCustomersTableInformation = (accountNumber: string) => {
  const {
    isLoading,
    data: getCustomersTableInfoResponse,
    error,
  } = useQuery({
    queryKey: ["customersTableInfo", accountNumber],
    queryFn: () => apiService.GetCustomerTableInformation(accountNumber),
  });

  return { isLoading, getCustomersTableInfoResponse, error };
}

export const useGetCustomerMonthlyConsumption = (accountNumber: string, enabled: boolean) => {
  const {
    isLoading,
    data: getCustomerMonthlyConsumptionResponse,
    error,
  } = useQuery({
    queryKey: ["customerMonthlyConsumptionStats", accountNumber],
    queryFn: () => apiService.GetCustomerMonthlyConsumption(accountNumber),
    enabled: enabled,
  });

  return { isLoading, getCustomerMonthlyConsumptionResponse, error };
}

export const useGetCustomerAccountStatement = (accountNumber: string, enabled: boolean) => {
  const {
    isLoading,
    data: getCustomerAccountStatement,
    error,
  } = useQuery({
    queryKey: ["getCustomerAccountStatement", accountNumber],
    queryFn: () => apiService.GetCustomerAccountStatement(accountNumber),
    enabled: enabled,
  });

  return { isLoading, getCustomerAccountStatement, error };
}

export const useGetSlaTicketSummary = (range: "MONTH" | "TODAY") => {
  let dateFrom: string;
  let dateTo: string;

  const now = new Date();

  if (range === "MONTH") {
    // First day of month in UTC
    const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const to = new Date();

    dateFrom = from.toISOString();
    dateTo = to.toISOString();

  } else {
    // Start of today in UTC
    const from = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0
    ));

    const to = new Date();

    dateFrom = from.toISOString();
    dateTo = to.toISOString();
  }

  const { isLoading, data: SlaTicketData, error } = useQuery({
    queryKey: ["getSlaTicketSummary", range],
    queryFn: () => apiService.GetTicketSummary(dateFrom, dateTo),
  });

  return { isLoading, SlaTicketData, error }
}

export const useGetSlaCountSummary = (range: "MONTH" | "TODAY") => {
  let dateFrom: string;
  let dateTo: string;

  const now = new Date();

  if (range === "MONTH") {
    // First day of month in UTC
    const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const to = new Date();

    dateFrom = from.toISOString();
    dateTo = to.toISOString();

  } else {
    // Start of today in UTC
    const from = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0
    ));

    const to = new Date();

    dateFrom = from.toISOString();
    dateTo = to.toISOString();
  }

  const { isLoading, data: SlaCountData, error } = useQuery({
    queryKey: ["getSlaCountSummary", range],
    queryFn: () => apiService.GetSlaCountSummary(dateFrom, dateTo),
  });

  return { isLoading, SlaCountData, error }
}

export const useGetCategoryWiseSummary = () => {
  const { dateFrom, dateTo } = useMemo(() => {
    const now = new Date();

    const from = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1
    ));

    return {
      dateFrom: from.toISOString(),
      dateTo: now.toISOString(),
    };
  }, []);

  const { isLoading, data, error } = useQuery({
    queryKey: ["getCategoryWiseSummaryData", dateFrom, dateTo],
    queryFn: () => apiService.GetCategoryWiseSummary(dateFrom, dateTo, 0),
  });

  return { isLoading, CategoryWiseData: data, error };
}

export const useGetDayWiseSummary = () => {
  const { dateFrom, dateTo } = useMemo(() => {
    const now = new Date();

    const from = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1
    ));

    return {
      dateFrom: from.toISOString(),
      dateTo: now.toISOString(),
    };
  }, []);

  const { isLoading, data, error } = useQuery({
    queryKey: ["getDayWiseSummaryData", dateFrom, dateTo],
    queryFn: () => apiService.GetDayWiseSummary(dateFrom, dateTo, 0),
  });

  return { isLoading, DayWiseData: data, error }
}

export const useGetDivisionWiseSummary = () => {
  const { dateFrom, dateTo } = useMemo(() => {
    const now = new Date();

    const from = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1
    ));

    return {
      dateFrom: from.toISOString(),
      dateTo: now.toISOString(),
    };
  }, []);

  const { isLoading, data, error } = useQuery({
    queryKey: ["getDivisionWiseSummaryData", dateFrom, dateTo],
    queryFn: () => apiService.GetDivisionWiseSummary(dateFrom, dateTo, 0),
  });

  return { isLoading, DivisionWiseData: data, error }
}

export const useGetEscalationAndSlaSummary = () => {
  const { dateFrom, dateTo } = useMemo(() => {
    const now = new Date();

    const from = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1
    ));

    return {
      dateFrom: from.toISOString(),
      dateTo: now.toISOString(),
    };
  }, []);

  const { isLoading, data, error } = useQuery({
    queryKey: ["getEscalationAndSlaData", dateFrom, dateTo],
    queryFn: () => apiService.GetEscalationAndSlaSummary(dateFrom, dateTo, 0),
  });

  return { isLoading, EscalationAndSlaData: data, error }
}