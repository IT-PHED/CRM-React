import { useGetCustomerAccountStatement } from '@/hooks/useApiQuery';
import { formatCurrencyString, formatUTCString, nullToString } from '@/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import AccountStatementLoader from './accountStatementLoader';
import { useMemo } from 'react';

interface Props {
    accountInfo?: ICustomerProfile;
}

export const transformBillingRecord = (raw: IAccountHistoryRecord) => ({
    date: formatUTCString(raw.BILLDATE),                              // Keep original DD-MM-YYYY format
    amount: formatCurrencyString(raw.CURRENT_BILL_AMOUNT),
    balance: formatCurrencyString(raw.BALANCE),
    reading: nullToString(raw.READING),
    consumption: nullToString(raw.CONSUMPTION),
    kva: nullToString(raw.KVA),
    code: nullToString(raw.READCODE),
    tariff: nullToString(raw.TARIFF),
    billId: String(raw.ID),
    receipt: nullToString(raw.RECEIPTNUMBER),
    remarks: nullToString(raw.REMARKS),
});


const datae = [
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Bill" },
    { date: "01-01-2019", amount: "87,761.18", balance: "87,761.18", reading: "238240", consumption: "1789", kva: "0", code: "R", tariff: "C2", billId: "16311505", receipt: "", remarks: "Bill" },
    { date: "21-01-2019", amount: "87,761.18", balance: "0.00", reading: "", consumption: "", kva: "", code: "", tariff: "", billId: "", receipt: "1902128490-2784691", remarks: "Payment" },
    { date: "01-02-2019", amount: "0.00", balance: "0.00", reading: "238240", consumption: "0", kva: "0", code: "M", tariff: "C2", billId: "16886387", receipt: "", remarks: "Bill" },
    { date: "01-03-2019", amount: "140,692.61", balance: "140,692.61", reading: "241108", consumption: "2868", kva: "0", code: "R", tariff: "C2", billId: "17524918", receipt: "", remarks: "Billxxxx" },
]

const AccountStatement = ({ accountInfo }: Props) => {
    const { isLoading, getCustomerAccountStatement, error } = useGetCustomerAccountStatement(accountInfo?.CONS_ACC, !!accountInfo?.CONS_ACC);


    const downloadPDF = async () => {
        const element = document.getElementById('pdf-content');
        if (!element) return;

        try {
            // 1. Capture the entire long div
            const canvas = await html2canvas(element, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: "#FFFFFF"
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Define Margin
            const margin = 15; // 10mm margin on the PDF page
            const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgHeightInPdf = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeightInPdf;
            let position = 0;

            // Add first page with margin offset
            pdf.addImage(imgData, 'PNG', margin, position + margin, pdfWidth, imgHeightInPdf);
            heightLeft -= (pdfHeight - margin * 2);

            while (heightLeft > 0) {
                // Calculate position to shift the "view" up, while maintaining the top margin
                position = heightLeft - imgHeightInPdf + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, pdfWidth, imgHeightInPdf);
                heightLeft -= pdfHeight;
            }

            pdf.save(`${accountInfo?.CONS_ACC}_PHED_Account_Statement.pdf`);
        } catch (error) {
            console.error("Multi-page PDF Error:", error);
        }
    };

    const billingRecords = getCustomerAccountStatement?.data;
    const formattedBillingData = useMemo(() => {
        if (!billingRecords?.length) return [];

        return billingRecords
            .sort((a, b) => new Date(b.BILLMONTH).getTime() - new Date(a.BILLMONTH).getTime())
            .map(transformBillingRecord);
    }, [billingRecords]);

    if (isLoading) return <AccountStatementLoader />

    if (error) return (
        <div style={{ color: "#DC2626", padding: "20px", fontWeight: "bold" }}>
            Error: Could not retrieve account history. Please check your connection.
        </div>
    );


    return (
        <div style={{ padding: "20px" }}>
            <button
                onClick={downloadPDF}
                style={{
                    position: "fixed",
                    bottom: "-2%",
                    left: "0",
                    right: "0",
                    height: "40px",
                    maxWidth: "30vw",
                    marginLeft: "auto",
                    marginRight: "auto",
                    backgroundColor: "#007BFF",
                    color: "#FFFFFF",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "20px",
                    fontWeight: "bold"
                }}
            >
                Download PDF Statement
            </button>
            <div style={{
                maxHeight: "300px", // Adjust based on your screen size
                overflowY: "auto",
                overflowX: "auto",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                backgroundColor: "#F9FAFB" // Light gray background for the "viewer"
            }}>
                <div id="pdf-content" style={{
                    backgroundColor: "#FFFFFF",
                    //padding: "20px",
                    padding: "15mm",
                    fontFamily: "Arial, sans-serif",
                    boxSizing: "border-box",
                    width: "1000px",
                    color: "#000000"
                }}>
                    {/* Header Section */}
                    <div style={{ borderBottom: "3px solid #000000", paddingBottom: "10px", marginBottom: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <img src="/phed-logo.png" alt="PHED" style={{ height: "60px" }} />
                            <div style={{ textAlign: "left", fontSize: "14px", fontWeight: "bold" }}>
                                <p style={{ margin: "2px 0" }}>Address : #1 Moscow Road, Port Harcourt,</p>
                                <p style={{ margin: "2px 0" }}>Rivers State, Nigeria</p>
                                <p style={{ margin: "2px 0" }}>Customer Care : 070022557433</p>
                            </div>
                        </div>
                    </div>

                    <h2 style={{ textAlign: "center", textTransform: "uppercase", margin: "10px 0", fontSize: "18px" }}>
                        Account History Statement
                    </h2>
                    <hr style={{ border: "1px solid #000000" }} />

                    {/* Account Details Metadata */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", fontSize: "12px", padding: "15px 0" }}>
                        <div>
                            <p><strong>Account No :</strong> {accountInfo.CONS_ACC}</p>
                            <p><strong>MD/NonMD :</strong> {accountInfo.SBT_TARIFF?.split("-")[1]}</p>
                            <p><strong>Book No :</strong> {accountInfo.BOOKNO}</p>
                            <p><strong>Name :</strong> {accountInfo.CONSUMER_NAME}</p>
                            <p><strong>Address :</strong> {accountInfo.ADDRESS}</p>
                        </div>
                        <div>
                            <p><strong>Meter Serial No :</strong> {accountInfo.METERNO}</p>
                            <p><strong>Factor Amount :</strong> {accountInfo.FACTOR_AMOUNT}</p>
                            <p><strong>Tariff :</strong> {accountInfo.TARIFF}</p>
                            <p><strong>Account Status :</strong> {accountInfo.CON_CONSUMERSTATUS}</p>
                        </div>
                        <div>
                            <p><strong>Marketer Name :</strong> {accountInfo.MARKETERNAME}</p>
                            <p><strong>Zone. :</strong> {accountInfo.ZONE}</p>
                            <p><strong>GPS N :</strong> 4.83412</p>
                            <p><strong>GPS E :</strong> 6.99365</p>
                        </div>
                    </div>

                    {/* History Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", marginTop: "10px", marginBottom: "5px" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #000000", borderTop: "2px solid #000000", textAlign: "left" }}>
                                <th style={{ padding: "8px 4px" }}>Date</th>
                                <th style={{ padding: "8px 4px" }}>Amount</th>
                                <th style={{ padding: "8px 4px" }}>Balance</th>
                                <th style={{ padding: "8px 4px" }}>Reading</th>
                                <th style={{ padding: "8px 4px" }}>Consumption</th>
                                <th style={{ padding: "8px 4px" }}>KVA</th>
                                <th style={{ padding: "8px 4px" }}>Read Code</th>
                                <th style={{ padding: "8px 4px" }}>Tariff</th>
                                <th style={{ padding: "8px 4px" }}>Bill ID</th>
                                <th style={{ padding: "8px 4px" }}>Receipt No</th>
                                <th style={{ padding: "8px 4px" }}>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {//formattedBillingData
                                formattedBillingData.map((row, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #E5E7EB" }}>
                                        <td style={{ padding: "8px 4px" }}>{row.date}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.amount}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.balance}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.reading}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.consumption}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.kva}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.code}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.tariff}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.billId}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.receipt}</td>
                                        <td style={{ padding: "8px 4px" }}>{row.remarks}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountStatement;