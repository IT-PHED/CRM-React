import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import SearchSection from "@/components/customerInformation/SearchSection";
import AccountStatement from "@/components/customerInformation/accountStatement";
import ConsumptionCharts from "@/components/customerInformation/consumptionChart";
import CustomerCards from "@/components/customerInformation/customerCards";
import CustomerSkeleton from "@/components/customerInformation/customerSkeleton";
import CustomerTable from "@/components/customerInformation/customerTable";
import TabbedSection from "@/components/customerInformation/tabbedSection";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetCustomerInformation, useGetCustomerMonthlyConsumption, useGetCustomersLikeAccountNumber, useSearchCustomerInformation } from "@/hooks/useApiQuery";
import { Zap } from "lucide-react";

const CustomerInformation = () => {
    const [query, setQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [mode, setMode] = useState<"single" | "multiple" | null>(null);
    const { countCustomers, isPending: isCounting, } = useSearchCustomerInformation((newMode) => setMode(newMode), setIsModalOpen);
    const { getCustomersLikeAccountNumberResponse, isLoading: isGettingCustomers } = useGetCustomersLikeAccountNumber(query, mode === "multiple" && !!query);
    const { CustomerInformation: customerData, isLoading: isGettingDetails } = useGetCustomerInformation(query, mode === "single" && !!query);

    const handleSearch = () => {
        if (!query.trim()) return;
        // Reset mode before searching to clear old states
        setMode(null);
        countCustomers(query.trim());
    };


    const handleReset = () => {
        setQuery("");
        setMode(null);
        setIsModalOpen(false);
    };

    const hasData = !!customerData?.data;
    const isSearching = isCounting || isGettingDetails;

    const { getCustomerMonthlyConsumptionResponse, isLoading: isGettingMonthlyConsumption } = useGetCustomerMonthlyConsumption(query, hasData);

    return (
        <DashboardLayout>
            <SearchSection
                showViewBtn={hasData}
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
                onReset={handleReset}
                isLoading={isSearching}
                handleAccount={setIsAccountModalOpen}
            />

            <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
                <DialogContent className="xmax-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Account Statement</DialogTitle>
                      
                    </DialogHeader>
                    <AccountStatement accountInfo={customerData?.data} />
                </DialogContent>
            </Dialog>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Select a Customer</DialogTitle>
                        <DialogDescription>Matches found for "{query}"</DialogDescription>
                    </DialogHeader>

                    {isGettingCustomers ? (
                        <div className="p-10 text-center">Loading list...</div>
                    ) : (
                        <CustomerTable
                            data={getCustomersLikeAccountNumberResponse?.data.value || []}
                            onSelect={(accNum) => {
                                setQuery(accNum);
                                setMode("single"); // Triggers the detail fetch
                                setIsModalOpen(false);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {!customerData && !isCounting && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                        <Zap className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-medium text-foreground">Search for a Customer</h2>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        Enter a Customer Account Number or Meter Number to view their details, billing history, and consumption data.
                    </p>
                </div>
            )}

            {isGettingDetails && (
                <CustomerSkeleton />
            )}

            {mode === "single" && !isGettingDetails && hasData && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 my-8">
                    <CustomerCards customer={customerData.data} />
                    <TabbedSection accountNumber={query} />
                    <ConsumptionCharts data={getCustomerMonthlyConsumptionResponse} />
                </div>
            )}

            {mode === "single" && !isGettingDetails && !hasData && (
                <div className="py-20 text-center text-muted-foreground">
                    <p>No customer profile data available for "{query}".</p>
                </div>
            )}
        </DashboardLayout>
    )
}

export default CustomerInformation;