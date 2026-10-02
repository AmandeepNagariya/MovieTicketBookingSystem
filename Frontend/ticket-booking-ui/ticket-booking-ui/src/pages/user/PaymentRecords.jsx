import { useEffect, useState } from "react";
import api from "../../services/api";

export default function PaymentRecords() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            api.get(`/payment/user/${user.id}`)
               .then(res => setData(res.data))
               .catch(err => console.error("Could not load payments:", err));
        }
    }, []);

    const downloadPDF = async () => {
        setLoading(true);
        try {
            // responseType: 'blob' is CRITICAL for PDF files
            const response = await api.get(`/pdf/download-invoice/${user.id}`, {
                responseType: 'blob' 
            });

            // Create a local URL for the downloaded file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${user.fullName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Error downloading PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>My Booking History</h3>
                <button 
                    className="btn btn-outline-danger" 
                    onClick={downloadPDF}
                    disabled={loading || data.length === 0}
                >
                    <i className="bi bi-file-earmark-pdf"></i> 
                    {loading ? "Generating..." : "Download Invoice PDF"}
                </button>
            </div>

            <table className="table table-hover shadow-sm border">
                <thead className="table-dark">
                    <tr>
                        <th>Movie</th>
                        <th>Amount</th>
                        <th>Seats</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(p => (
                        <tr key={p.id}>
                            <td>{p.movieName}</td>
                            <td>₹{p.amount}</td>
                            <td><span className="badge bg-info text-dark">{p.seatNumbers}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}