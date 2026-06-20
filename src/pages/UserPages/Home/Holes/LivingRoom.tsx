import { Box, Typography } from "@mui/material";

export default function LivingRoom() {
  const houses = [
    {
      title: "Green Park",
      desc: "Tangerang, Indonesia",
      img: "/src/assets/Images/LivingRoom1.png",
    },
    {
      title: "Podo Wae",
      desc: "Madiun, Indonesia",
      img: "/src/assets/Images/LivingRoom2.png",
    },
    {
      title: "Silver Rain",
      desc: "Bandung, Indonesia",
      img: "/src/assets/Images/LivingRoom3.png",
    },
    {
      title: "Cashville",
      desc: "Kemang, Indonesia",
      img: "/src/assets/Images/LivingRoom4.png",
    },
  ];

  return (
    <Box sx={{ py: 5,  }}>
      {/* 🔥 TITLE */}
      <Box sx={{display:"flex", justifyContent:"center",alignItems:"center"}}>
   <Typography
  sx={{
    fontSize: { xs: "22px", md: "30px" },
    fontWeight: 700,
    color: "#152c5b",
    mb: 6,
    display: "inline-block",
    letterSpacing: "0.5px",
    transition: "0.3s ease",
    cursor: "default",

    "&::after": {
      content: '""',
      position: "absolute",
      width: "0%",
      height: "4px",
      bottom: -6,
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(90deg, #ff7a00, #ffb347)",
      borderRadius: "10px",
      transition: "0.4s ease",
    },

    "&:hover::after": {
      width: "100%",
    },

    "&:hover": {
      transform: "translateY(-2px)",
    },
  }}
>
  Hotels with{" "}
  <Box
    component="span"
    sx={{
      color: "#ff7a00",
      fontWeight: 700,
      background: "linear-gradient(90deg, #ff7a00, #ffb347)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    large living room
  </Box>
</Typography>

      </Box>
  
      {/* 🔥 CARDS */}
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

/* 💥 CARD STYLE */
const cardStyle = {
  width: { xs: "100%", sm: 380, md: 410 },
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

/* 💥 IMAGE WRAPPER */
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