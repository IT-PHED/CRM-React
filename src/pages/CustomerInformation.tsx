import { DashboardLayout } from "@/components/DashboardLayout";
import SearchSection from "@/components/customerInformation/SearchSection";
import ConsumptionCharts from "@/components/customerInformation/consumptionChart";
import CustomerCards from "@/components/customerInformation/customerCards";
import TabbedSection from "@/components/customerInformation/tabbedSection";
import { mockCustomer } from "@/lib/mockData";
import { Zap } from "lucide-react";
import { useState } from "react";

const CustomerInformation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showData, setShowData] = useState(false);

    const handleSearch = (query: string) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowData(true);
        }, 800);
    };

    const handleReset = () => {
        setShowData(false);
    };

    return (
        <DashboardLayout>
            <SearchSection onSearch={handleSearch} onReset={handleReset} isLoading={isLoading} />

            {!showData && !isLoading && (
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

            {showData && (
                <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 my-8">
                    <CustomerCards customer={mockCustomer} />
                    <TabbedSection />
                    <ConsumptionCharts />
                </div>
            )}

        </DashboardLayout>
    )
}

export default CustomerInformation;