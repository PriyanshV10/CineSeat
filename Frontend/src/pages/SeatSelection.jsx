import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShowById, getShowSeats, createBooking, confirmBooking } from "../services/api.js";

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let showData;
        try {
          showData = await getShowById(id);
        } catch (e) {
          console.warn("API failed, using mock data for show details");
          showData = {
            id: id,
            movie: { title: "Mock Movie" },
            theater: { name: "Mock Theater" },
            screen: { name: "Screen 1" },
            startTime: new Date().toISOString(),
          };
        }
        setShow(showData);

        let seatsData;
        try {
          seatsData = await getShowSeats(id);
        } catch (e) {
          console.warn("API failed, using mock data for seats");
          // Generate mock seats
          const rows = ["A", "B", "C", "D", "E", "F", "G"];
          seatsData = [];
          let seatId = 1;
          rows.forEach((row) => {
            for (let i = 1; i <= 10; i++) {
              seatsData.push({
                id: seatId++,
                row: row,
                number: i,
                status: Math.random() > 0.8 ? "BOOKED" : "AVAILABLE",
                price: row === "A" ? 300 : 200,
              });
            }
          });
        }
        setSeats(seatsData);
      } catch (err) {
        console.error("Failed to load show data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleSeat = (seat) => {
    if (seat.status === "BOOKED") return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((sid) => sid !== seat.id));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert("You can select up to 6 seats max.");
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  const calculateTotal = () => {
    return selectedSeatIds.reduce((total, seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      return total + (seat ? seat.price : 0);
    }, 0);
  };

  const handleBooking = async () => {
    if (selectedSeatIds.length === 0) return;

    setBookingLoading(true);
    const bookingData = {
      showId: id,
      showSeatIds: selectedSeatIds,
      totalPrice: calculateTotal(),
    };

    try {
      const response = await createBooking(bookingData);
      if (response && response.status === "PENDING") {
        // Since payment is not yet integrated, we will automatically confirm the booking
        await confirmBooking(response.id);
        
        // Navigate to success and pass the confirmed booking status
        navigate("/booking/success", { state: { booking: { ...response, status: "CONFIRMED" } } });
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking API failed:", err);
      alert("Failed to create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!show)
    return (
      <div className="text-foreground text-center py-20 bg-background min-h-screen">
        Show not found
      </div>
    );

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pt-20 pb-12 px-4 min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-glow">
          {show.movie.title}
        </h1>
        <p className="text-muted-foreground text-sm flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-muted text-foreground text-xs font-medium">
            {show.theater.name}
          </span>
          <span>•</span>
          <span>{show.screen.name}</span>
          <span>•</span>
          <span className="text-primary font-medium">
            {new Date(show.startTime).toLocaleString()}
          </span>
        </p>
      </div>

      {/* Screen */}
      <div className="mb-16 relative perspective-[1000px]">
        {/* Glowing Screen Effect */}
        <div className="h-16 bg-gradient-to-b from-primary/20 to-transparent w-3/4 mx-auto rounded-t-[50%] opacity-50 blur-sm transform rotate-x-12"></div>
        {/* Actual Screen Line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent w-3/4 mx-auto rounded-[50%] shadow-[0_0_20px_rgba(124,58,237,0.5)]"></div>
        <p className="text-center text-xs text-muted-foreground mt-6 uppercase tracking-[0.5em] font-light">
          Screen
        </p>
      </div>

      {/* Seat Map */}
      <div className="mb-12 overflow-x-auto pb-12 custom-scrollbar flex justify-center">
        <div className="min-w-[600px] flex flex-col items-center gap-3">
          {/* Render rows */}
          {Array.from(new Set(seats.map((s) => s.row)))
            .sort()
            .map((row) => (
              <div key={row} className="flex items-center gap-6">
                <span className="w-6 text-center text-xs text-muted-foreground font-medium">
                  {row}
                </span>
                <div className="flex gap-2">
                  {seats
                    .filter((s) => s.row === row)
                    .sort((a, b) => a.number - b.number)
                    .map((seat) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const isBooked = seat.status === "BOOKED";

                      return (
                        <button
                          key={seat.id}
                          disabled={isBooked}
                          onClick={() => toggleSeat(seat)}
                          className={`
                            w-8 h-8 rounded-lg text-[10px] font-medium transition-all duration-300 flex items-center justify-center relative
                            ${
                              isBooked
                                ? "bg-muted text-transparent cursor-not-allowed border border-white/5 opacity-50"
                                : isSelected
                                  ? "bg-primary text-primary-foreground shadow-glow scale-110 border border-primary z-10"
                                  : "bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 hover:bg-primary/20 hover:text-primary-foreground hover:scale-105"
                            }
                          `}
                        >
                          {isBooked ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive/50"></div>
                          ) : (
                            seat.number
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 mb-12 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-white/5 border border-white/10"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-primary shadow-glow-sm"></div>
          <span className="text-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-muted border border-white/5 flex items-center justify-center opacity-50">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive/50"></div>
          </div>
          <span>Booked</span>
        </div>
      </div>

      {/* Booking Summary - Glass Card */}
      <div className="glass p-8 rounded-2xl mb-12 max-w-3xl mx-auto border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">
              Total Price
            </p>
            <p className="text-4xl font-bold text-foreground tracking-tight text-glow">
              Rs. {calculateTotal()}
            </p>
            {selectedSeatIds.length > 0 && (
              <p className="text-sm text-primary mt-2 font-medium">
                {selectedSeatIds.length} seats selected
              </p>
            )}
          </div>
          <button
            onClick={handleBooking}
            disabled={selectedSeatIds.length === 0 || bookingLoading}
            className={`
              px-8 py-3 rounded-xl font-bold tracking-wide transition-all duration-300
              ${
                selectedSeatIds.length === 0 || bookingLoading
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-glow"
              }
            `}
          >
            {bookingLoading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
