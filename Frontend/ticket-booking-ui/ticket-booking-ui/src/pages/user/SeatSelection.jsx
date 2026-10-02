import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../../services/api";
import Payment from "./Payment";

export default function SeatSelection() {
  const { id } = useParams(); // Get ID from URL
  const { state: movie } = useLocation();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // 🔥 Ensure your API path matches your Backend Controller
    api.get(`/seats/${id}`).then(res => setSeats(res.data));
  }, [id]);

  const toggle = (seat) => {
    if (seat.isBooked) return;
    setSelected(prev =>
      prev.includes(seat.seatNumber)
        ? prev.filter(s => s !== seat.seatNumber)
        : [...prev, seat.seatNumber]
    );
  };

  // Grouping seats into rows A, B, C...
  const rows = {};
  seats.forEach(s => {
    const r = s.seatNumber[0];
    if (!rows[r]) rows[r] = [];
    rows[r].push(s);
  });

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4 bg-white rounded-4">
        <h2 className="fw-bold mb-4">{movie?.movieName} - Seat Selection</h2>
        
        {/* Cinema Screen Design */}
        <div className="screen-container mb-5">
          <div className="screen-curve"></div>
          <p className="text-muted small mt-2">All eyes this way!</p>
        </div>

        {/* Legend */}
        <div className="d-flex justify-content-center gap-4 mb-5">
          <div className="small"><span className="badge bg-light border text-dark me-1">o</span> Available</div>
          <div className="small"><span className="badge bg-success me-1">o</span> Selected</div>
          <div className="small"><span className="badge bg-danger me-1">o</span> Booked</div>
        </div>

        {/* Seating Grid */}
        <div className="seating-area overflow-auto">
          {Object.keys(rows).sort().map(r => (
            <div key={r} className="d-flex justify-content-center align-items-center mb-2">
              <strong className="me-3 text-secondary" style={{width: '20px'}}>{r}</strong>
              
              {rows[r].map((seat, i) => (
                <div key={seat.id}
                  onClick={() => toggle(seat)}
                  className={`seat-box d-flex align-items-center justify-content-center rounded-2 
                    ${seat.isBooked ? "booked" : selected.includes(seat.seatNumber) ? "selected" : "available"}`}
                  style={{
                    // 🔥 Professional Trick: Create aisles after 3rd and 7th seat
                    marginRight: (i === 2 || i === 7) ? '30px' : '6px'
                  }}>
                  {seat.seatNumber.slice(1)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-start">
              <p className="mb-0 text-muted">Selected Seats: <strong>{selected.join(", ") || "None"}</strong></p>
              <h4 className="fw-bold">Total: ₹{selected.length * (movie?.price || 0)}</h4>
            </div>
            {selected.length > 0 && (
              <Payment movie={movie} selectedSeats={selected} totalAmount={selected.length * movie.price} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .screen-curve {
          height: 12px;
          width: 80%;
          margin: 0 auto;
          background: #e0e0e0;
          border-radius: 50% / 100% 100% 0 0;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .seat-box {
          width: 32px;
          height: 32px;
          font-size: 11px;
          cursor: pointer;
          transition: 0.2s;
          border: 1px solid #ddd;
        }
        .seat-box.available { background: #f8f9fa; color: #333; }
        .seat-box.available:hover { background: #e9ecef; transform: scale(1.1); }
        .seat-box.selected { background: #198754; color: white; border-color: #198754; box-shadow: 0 0 10px rgba(25,135,84,0.4); }
        .seat-box.booked { background: #dc3545; color: white; border-color: #dc3545; cursor: not-allowed; opacity: 0.6; }
      `}</style>
    </div>
  );
}