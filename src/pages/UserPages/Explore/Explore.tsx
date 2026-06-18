
import {
  Box,
  Card,
  Chip,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import cardImage from "../../../assets/card.png";
import PageHeader from "../../../shared/userSharedComponent/PageHeader/PageHeader";
import { useEffect, useState } from "react";
import axiosClient from "../../../services/api/axiosClient";
interface Ad {
  _id: string;
  isActive: boolean;
  room: {
    _id: string;
    roomNumber: string;
    price: number;
    capacity: number;
    discount: number;
    images: string[];
  };
}
export default function Explore() {

const [ads, setAds] = useState<Ad[]>([]);

useEffect(() => {
  getAds();
}, []);

const getAds = async () => {
  try {
    const response = await axiosClient.get("/portal/ads");
    console.log(response.data);

    setAds(response.data.data.ads);
  } catch (error) {
    console.log(error);
  }
};
  const rooms = [
    { id: 1, price: 2500, discount: 12, room: 207 },
    { id: 2, price: 1800, discount: 10, room: 105 },
    { id: 3, price: 3000, discount: 20, room: 310 },
    { id: 4, price: 2200, discount: 5, room: 410 },
  ];
  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        width: { xs: "100%", md: "90%" },
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
      }}
    >
      <PageHeader title="Explore ALL Rooms" />
      <Typography sx={{ my: 3 }}>All Rooms</Typography>
      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Card
            key={ad._id}
            sx={{
              width: { xs: "100%", md: "400px" },
              height: "250px",
              position: "relative",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: 4,
              mb: 3,
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 6,
              },
            }}
          >
            {/* Image */}
            <img
              src={ad.room?.images?.[0] || cardImage}
              alt="room"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Dark overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
              }}
            />

            {/* Price badge  */}
            <Typography
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#FF498B",
                color: "#fff",
                borderRadius: "0px 15px",
                px: 2,
                py: 0.5,
                fontSize: "13px",
                fontWeight: "bold",
                zIndex: 2,
              }}
            >
              ${ad.room?.price} / night
            </Typography>

            {/* Discount */}
            {ad.room.discount > 0 && (

            <Chip
              label={`${ad.room?.discount || 0}% OFF`}
              color="error"
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                fontWeight: "bold",
                zIndex: 2,
              }}
            />
            )}

            {/* Room number */}
            <Typography
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                color: "#fff",
                fontWeight: "bold",
                zIndex: 2,
                fontSize: "15px",
                backgroundColor: "rgba(0,0,0,0.4)",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              Room : {ad.room?.roomNumber}<br/>
              Capacity : {ad.room.capacity}
            </Typography>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
