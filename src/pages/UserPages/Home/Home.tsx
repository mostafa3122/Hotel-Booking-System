import { Box, Typography, Grid } from "@mui/material";
import BookingCard from "./BookingCard/BookingCard";
import AllAds from "../Ads/AllAds";
import Houses from "./Houses/Houses";
import LivingRoom from "./Holes/LivingRoom";
import AdsCarsol from "../Ads/AdsCarsol/AdsCarsol";
import ReviewsHome from "../ReviewsHome/ReviewsHome";

export default function Home() {
  return (
    <Box>
      
      {/* HERO SECTION */}
      <Box sx={{ px: { xs: 2, md: 8 }, py: 6 }}>
        <Grid container spacing={4} sx={{alignItems:"center"}}>

          {/* LEFT SIDE */}
          <Grid size={{xs:12, md:6}} >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              
              <Typography
                variant="h4"
                sx={{
                  color: "#152c5b",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Forget Busy Work, <br />
                Start Next Vacation
              </Typography>

              <Typography
                sx={{
                  color: "rgba(0,0,0,0.6)",
                  fontSize: "14px",
                  maxWidth: "400px",
                }}
              >
                We provide what you need to enjoy your holiday with family. Time to
                make another memorable moments.
              </Typography>

              <BookingCard />
            </Box>
          </Grid>

          {/* RIGHT SIDE */}
          <Grid size= {{xs:12 ,md:6}}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "457px",
                  height: { xs: "320px", md: "450px" },
                  borderRadius: "150px 50px 24px 24px",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src="/src/assets/Home.png"
                  alt="vacation hero"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Box>

      {/* ADS SECTION */}
      <Box sx={{ px: { xs: 2, md: 8 }, pb: 6 }}>
        <AllAds />
      </Box>
       <Box sx={{ px: { xs: 2, md: 8 }, pb: 6 }}>
        <Houses />
      </Box>
       <Box sx={{ px: { xs: 2, md: 8 }, pb: 6 }}>
        <LivingRoom/>
      </Box>
       <Box sx={{ px: { xs: 2, md: 8 }, pb: 6 }}>
        <AdsCarsol/>
      </Box>

        <Box sx={{ px: { xs: 2, md: 8 }, pb: 6 }}>
          <ReviewsHome/>
      </Box>
    </Box>
  );
}