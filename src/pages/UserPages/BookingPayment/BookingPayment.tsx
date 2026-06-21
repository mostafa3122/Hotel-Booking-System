import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AuthContext } from "../../../context/AuthContext";
import { createBooking, payBooking } from "../../../services/api/booking";
import { toast } from "react-toastify";
import cardImage from "../../../assets/card.png";
import paymentImg from "../../../assets/payment.png";

const stripePromise = loadStripe(
  "pk_test_51OTjURBQWp069pqTmqhKZHNNd3kMf9TTynJtLJQIJDOSYcGM7xz3DabzCzE7bTxvuYMY0IX96OHBjsysHEKIrwCK006Mu7mKw8"
);

interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  discount: number;
  capacity: number;
  images: string[];
}

interface BookingState {
  room: Room;
  startDate: string;
  endDate: string;
  nights: number;
  subTotal: number;
  tax: number;
  total: number;
}


function BookingPaymentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, token } = useContext(AuthContext);

  const stripe = useStripe();
  const elements = useElements();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingState | null>(() => {
    if (location.state) {
      return location.state as BookingState;
    }
    return null;
  });

  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  
  const [cardHolderName, setCardHolderName] = useState("");
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userData) {
      const nameParts = (userData.userName || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(userData.email || "");
    }
  }, [userData]);

  useEffect(() => {
    if (!bookingData) {
      toast.error("No active booking session. Please select a room first.");
      navigate("/");
    }
  }, [bookingData, navigate]);

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = "Valid email is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      if (validateStep1()) {
        setActiveStep(1);
      }
    }
  };

  const handlePrevStep = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    } else {
      navigate(-1);
    }
  };

  const handleSubmitBooking = async () => {
    if (!stripe || !elements || !bookingData) {
      toast.error("Stripe is not initialized yet.");
      return;
    }

    const errors: Record<string, string> = {};
    if (!cardHolderName.trim()) {
      errors.cardHolderName = "Card holder name is required";
      setStep2Errors(errors);
      return;
    }

    setLoading(true);
    try {
     
      const createResponse = await createBooking({
        room: bookingData.room._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice: bookingData.total,
      });

      const bookingId = createResponse.data?.booking?._id || createResponse.data?._id;
      if (!bookingId) {
        throw new Error("Could not retrieve booking ID from server.");
      }

     
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        throw new Error("Stripe elements not loaded.");
      }

   
      const { token: stripeToken, error } = await stripe.createToken(cardNumberElement, {
        name: cardHolderName,
      });

      if (error) {
        throw new Error(error.message);
      }


      await payBooking(bookingId, stripeToken.id);

      toast.success("Payment completed successfully!");
      setActiveStep(2); 
    } catch (error: any) {
      console.error(error);
      const msg = error.message || error?.response?.data?.message || "Failed to complete transaction.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  const { room, startDate, endDate, nights, subTotal, tax, total } = bookingData;

  const renderStepper = () => {
    const steps = [1, 2, 3];
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 6 }}>
        {steps.map((step, idx) => {
          const isCompleted = activeStep > idx || activeStep === 2;
          const isActive = activeStep === idx && activeStep !== 2;
          return (
            <React.Fragment key={step}>
              <Box
                onClick={() => setActiveStep(idx)}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: isCompleted ? "#1ABC9C" : isActive ? "#E2E8F0" : "#F8FAFC",
                  border: isActive ? "2px solid #3252DF" : "2px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isCompleted ? "#FFF" : "#152C5B",
                  fontWeight: 600,
                  fontFamily: "Poppins",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    borderColor: "#3252DF",
                  },
                }}
              >
                {isCompleted ? <CheckCircleIcon sx={{ fontSize: 24, color: "#FFF" }} /> : step}
              </Box>
              {idx < steps.length - 1 && (
                <Box sx={{ width: 60, height: 2, bgcolor: isCompleted ? "#1ABC9C" : "#E2E8F0" }} />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    );
  };

  const stripeStyle = {
    style: {
      base: {
        fontSize: "15px",
        fontFamily: "Poppins, sans-serif",
        color: "#152C5B",
        "::placeholder": {
          color: "#A0AEC0",
        },
      },
      invalid: {
        color: "#EF4444",
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
   
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "28px",
            fontWeight: 700,
            color: "#152C5B",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Stay
          <Box component="span" sx={{ color: "#3252DF" }}>
            cation.
          </Box>
        </Typography>
      </Box>

      {renderStepper()}

    
      {activeStep === 0 && (
        <Grid container spacing={5}>
          {/* Form Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #E2E8F0" }}>
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B", mb: 1 }}>
                Booking Information
              </Typography>
              <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "14px", mb: 4 }}>
                Please fill in your billing details below
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="First Name"
                  placeholder="e.g. Angga"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!step1Errors.firstName}
                  helperText={step1Errors.firstName}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontFamily: "Poppins" } }}
                />
                <TextField
                  label="Last Name"
                  placeholder="e.g. Risky"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!!step1Errors.lastName}
                  helperText={step1Errors.lastName}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontFamily: "Poppins" } }}
                />
                <TextField
                  label="Email Address"
                  placeholder="e.g. user@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!step1Errors.email}
                  helperText={step1Errors.email}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontFamily: "Poppins" } }}
                />
                <TextField
                  label="Phone Number"
                  placeholder="e.g. +1 202 555 0196"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={!!step1Errors.phone}
                  helperText={step1Errors.phone}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontFamily: "Poppins" } }}
                />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNextStep}
                    sx={{
                      bgcolor: "#3252DF",
                      py: 1.8,
                      borderRadius: "10px",
                      fontWeight: 600,
                      textTransform: "none",
                      fontFamily: "Poppins",
                      "&:hover": { bgcolor: "#203FC7" },
                    }}
                  >
                    Continue to Book
                  </Button>
                  <Button
                    onClick={handlePrevStep}
                    sx={{
                      color: "#A0AEC0",
                      py: 1.5,
                      textTransform: "none",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

       
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #E2E8F0", height: "100%" }}>
              <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B", mb: 3 }}>
                Booking Details Summary
              </Typography>

              <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
                <Box
                  component="img"
                  src={room.images?.[0] || cardImage}
                  sx={{ width: 140, height: 95, objectFit: "cover", borderRadius: "12px" }}
                  onError={(e) => {
                    e.currentTarget.src = cardImage;
                  }}
                />
                <Box>
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B", fontSize: "18px" }}>
                    Room {room.roomNumber}
                  </Typography>
                  <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "14px", mt: 0.5 }}>
                    Capacity: {room.capacity} People
                  </Typography>
                  {room.discount > 0 && (
                    <Typography sx={{ fontFamily: "Poppins", color: "#22C55E", fontWeight: 600, fontSize: "14px", mt: 0.5 }}>
                      {room.discount}% Special Discount Applied
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "15px" }}>Check-in</Typography>
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B" }}>{startDate}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "15px" }}>Check-out</Typography>
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B" }}>{endDate}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "15px" }}>Duration</Typography>
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B" }}>{nights} nights</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "15px" }}>Subtotal</Typography>
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B" }}>${subTotal.toFixed(0)} USD</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "15px" }}>Tax (10%)</Typography>
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B" }}>${tax.toFixed(0)} USD</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography sx={{ fontFamily: "Poppins", color: "#152C5B", fontWeight: 600, fontSize: "16px" }}>Total Price</Typography>
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 700, color: "#3252DF", fontSize: "20px" }}>
                    ${total.toFixed(0)} USD
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

   
      {activeStep === 1 && (
        <Grid container spacing={5}>
         
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #E2E8F0", height: "100%" }}>
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B", mb: 1 }}>
                Payment
              </Typography>
              <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "14px", mb: 4 }}>
                Kindly follow the instructions below
              </Typography>

              <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B", fontSize: "16px" }}>
                  Credit Card Payment:
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "15px" }}>
                  Tax: 10%
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", color: "#8A92A6", fontSize: "15px" }}>
                  Sub total: <Box component="span" sx={{ color: "#152C5B", fontWeight: 600 }}>${subTotal.toFixed(0)} USD</Box>
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", color: "#152C5B", fontWeight: 600, fontSize: "16px" }}>
                  Total: <Box component="span" sx={{ color: "#3252DF", fontWeight: 700 }}>${total.toFixed(0)} USD</Box>
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

             
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 40,
                    borderRadius: "6px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "14px", color: "#0B5CB4", fontStyle: "italic" }}>
                    VISA
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 70,
                    height: 40,
                    borderRadius: "6px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "13px", color: "#EB001B" }}>
                    MC
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", color: "#8A92A6" }}>
                  Secure payment via Stripe
                </Typography>
              </Box>
            </Paper>
          </Grid>

         
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #E2E8F0" }}>
              <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "#152C5B", mb: 3 }}>
                Complete Transaction Info
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
                {/* Stripe Card Number Element */}
                <Box>
                  <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#152C5B", fontWeight: 500, mb: 1 }}>
                    Card Number
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      p: 2,
                      bgcolor: "#F8FAFC",
                      "&:hover": { borderColor: "#CBD5E1" },
                    }}
                  >
                    <CardNumberElement options={stripeStyle} />
                  </Box>
                </Box>

                <Grid container spacing={2}>
                
                  <Grid size={{ xs: 6 }}>
                    <Box>
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#152C5B", fontWeight: 500, mb: 1 }}>
                        Expiry Date
                      </Typography>
                      <Box
                        sx={{
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          p: 2,
                          bgcolor: "#F8FAFC",
                          "&:hover": { borderColor: "#CBD5E1" },
                        }}
                      >
                        <CardExpiryElement options={stripeStyle} />
                      </Box>
                    </Box>
                  </Grid>

              
                  <Grid size={{ xs: 6 }}>
                    <Box>
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#152C5B", fontWeight: 500, mb: 1 }}>
                        CVC
                      </Typography>
                      <Box
                        sx={{
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          p: 2,
                          bgcolor: "#F8FAFC",
                          "&:hover": { borderColor: "#CBD5E1" },
                        }}
                      >
                        <CardCvcElement options={stripeStyle} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

              
                <TextField
                  label="Card Holder Name"
                  placeholder="e.g. Angga Risky"
                  value={cardHolderName}
                  onChange={(e) => {
                    setCardHolderName(e.target.value);
                    setStep2Errors((prev) => ({ ...prev, cardHolderName: "" }));
                  }}
                  error={!!step2Errors.cardHolderName}
                  helperText={step2Errors.cardHolderName}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontFamily: "Poppins", bgcolor: "#F8FAFC" } }}
                />

             
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmitBooking}
                    disabled={loading || !stripe}
                    sx={{
                      bgcolor: "#3252DF",
                      py: 1.8,
                      borderRadius: "10px",
                      fontWeight: 600,
                      textTransform: "none",
                      fontFamily: "Poppins",
                      "&:hover": { bgcolor: "#203FC7" },
                    }}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                  >
                    {loading ? "Processing..." : "Continue to Book"}
                  </Button>
                  <Button
                    onClick={handlePrevStep}
                    disabled={loading}
                    sx={{
                      color: "#A0AEC0",
                      py: 1.5,
                      textTransform: "none",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

   
      {activeStep === 2 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              maxWidth: 520,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "#152C5B",
                mb: 2,
              }}
            >
              Yay! Completed
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <Box
                component="img"
                src={paymentImg}
                alt="Payment completed"
                sx={{
                  width: "100%",
                  maxWidth: 260,
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: "Poppins",
                color: "#8A92A6",
                fontSize: "15px",
                lineHeight: "1.7",
                mb: 4,
                px: 2,
              }}
            >
              We will inform you via email later once the transaction has been accepted.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/explore")}
              sx={{
                bgcolor: "#3252DF",
                color: "#FFF",
                px: 5,
                py: 1.8,
                borderRadius: "10px",
                fontFamily: "Poppins",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "16px",
                boxShadow: "0 8px 24px rgba(50, 82, 223, 0.15)",
                "&:hover": {
                  bgcolor: "#203FC7",
                  boxShadow: "0 12px 30px rgba(50, 82, 223, 0.3)",
                },
              }}
            >
              Back to Home
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
}


export default function BookingPayment() {
  const defaultOptions = {
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#0066cc",
        colorBackground: "#f6f9fc",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "Ideal Sans, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "4px",
      },
    },
    loader: "auto" as const,
  };

  return (
    <Elements stripe={stripePromise} options={defaultOptions}>
      <BookingPaymentForm />
    </Elements>
  );
}
