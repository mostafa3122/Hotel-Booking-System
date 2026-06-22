import { Box, Typography } from "@mui/material";
import SharedTitle from "../../../../shared/userSharedComponent/SharedTitle/SharedTitle";
import LivingRoom1 from "../../../../assets/Images/LivingRoom1.png";
import LivingRoom2 from "../../../../assets/Images/LivingRoom2.png";
import LivingRoom3 from "../../../../assets/Images/LivingRoom3.png";
import LivingRoom4 from "../../../../assets/Images/LivingRoom4.png";
export default function LivingRoom() {
const houses = [
  {
    title: "Green Park",
    desc: "Tangerang, Indonesia",
    img: LivingRoom1,
  },
  {
    title: "Podo Wae",
    desc: "Madiun, Indonesia",
    img: LivingRoom2,
  },
  {
    title: "Silver Rain",
    desc: "Bandung, Indonesia",
    img: LivingRoom3,
  },
  {
    title: "Cashville",
    desc: "Kemang, Indonesia",
    img: LivingRoom4,
  },
];

  return (
    <Box sx={{ py: 5,  }}>
     <SharedTitle
  title="Hotels with"
  highlight="large living room"
/>
  
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {houses.map((house, index) => (
          <Box key={index} sx={cardStyle}>
            <Box sx={imageWrapper}>
              <img src={house.img} alt={house.title} style={imgStyle} />
            </Box>

            <Typography sx={{ fontSize: 18, fontWeight: 700, mt: 2 }}>
              {house.title}
            </Typography>

            <Typography sx={{ color: "gray", mb: 2 }}>
              {house.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

const cardStyle = {
  width: { xs: "100%", sm: 380, md: 300 },
  borderRadius: 4,
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.35s ease",

  "&:hover": {
    transform: "translateY(-12px) scale(1.05)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
  },
};

const imageWrapper = {
  overflow: "hidden",
  height: 260,
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "0.4s ease",
};