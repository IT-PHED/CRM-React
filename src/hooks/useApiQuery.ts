/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiService from "../services/apiEndpoints";
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner";
import { useParams } from "react-router-dom";

/**
 * 
 * COMPLAINT FUNCTIONALITY
 * 
 */
export const useCreateComplaint = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const {
        mutate: createComplaint,
        isPending,
        data,
        error,
    } = useMutation({
        mutationFn: (payload: any) =>
            apiService.CreateComplaint(payload, token),

        onSuccess: () => {
            toast.success("Complaint created successfully 🎉", {
                id: "create-complaint",
            });

            queryClient.invalidateQueries({ queryKey: ["complaintInformation"] });
        },
        onError: (err: any) => {
            toast.error(
                err?.message || "Failed to create Complaint",
                { id: "create-complaint" }
            );
        },
    });

    return {
        createComplaint,
        isPending,
        data,
        error,
    };
}

export const useReassignComplaint = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const {
        mutate: reassignComplaint,
        isPending,
        data,
        error,
    } = useMutation({
        mutationFn: (payload: any) =>
            apiService.ReassignComplaint(payload, token),

        onSuccess: () => {
            toast.success("Complaint reassigned successfully 🎉", {
                id: "reasign-complaint",
            });

            queryClient.invalidateQueries({ queryKey: ["complaintInformation"] });
        },
        onError: (err: any) => {
            toast.error(
                err?.message || "Failed to reassign Complaint",
                { id: "reassign-complaint" }
            );
        },
    });

    return {
        reassignComplaint,
        isPending,
        data,
        error,
    };
}

export const GetComplaintInformation = () => {
    const { token } = useAuth();
    const { id } = useParams<{ id: string }>();

    const { isLoading, data: complaintInfo, error } = useQuery({
        queryKey: ["complaintInformation"],
        queryFn: () => apiService.GetComplaintInformationById(id, token as string),
    });

    return { isLoading, complaintInfo, error };
}

export const GetAllDeptComplaintTable = (searchId: string) => {
    const { token, user } = useAuth();

    const { isLoading, data: allDeptComplaints, error } = useQuery({
        queryKey: ["DeptComplaintInfo", user.departmentId, searchId],
        queryFn: () => {
            if (searchId) {
                return apiService.QueryDepartmentComplaints(user.departmentId, searchId);
            }

            return apiService.GetDepartmentComplaints(user.departmentId, token as string);
        }
    });

    return { isLoading, allDeptComplaints, error };
}

export const useGetCrmMonthlyStats = () => {
    const { user } = useAuth();

    const { isLoading, data: monthlyStats, error } = useQuery({
        queryKey: ["crmMonthlyStats"],
        queryFn: () => apiService.GetCrmMonthlyStat(user.departmentId),
    });

    return { isLoading, monthlyStats, error };
}

export const useGetRegions = () => {
    const { isLoading, data: allRegions, error } = useQuery({
        queryKey: ["allRegions"],
        queryFn: () => apiService.GetRegions(),
    });

    return { isLoading, allRegions, error };
}

export const useGetAllRegionalUsersTable = (departmentId: string, accountNumber: string) => {
    const { isLoading, data: allRegionalStaffs, error } = useQuery({
        queryKey: ["regionalUsers", departmentId, accountNumber],
        queryFn: () => {
            if (departmentId && accountNumber) {
                return apiService.GetRegionalDepartmentMembers(departmentId, accountNumber);
            }

            return;
        }
    });

    return { isLoading, allRegionalStaffs, error };
}

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
            toast.error(
                err?.message || "Failed to close Complaint",
                { id: "close-complaint" }
            );
        },
    });

    return {
        closeComplaint,
        isPending,
        data,
        error,
    };
}