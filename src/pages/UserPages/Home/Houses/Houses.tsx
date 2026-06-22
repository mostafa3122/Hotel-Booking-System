import { Box, Typography } from "@mui/material";
import SharedTitle from "../../../../shared/userSharedComponent/SharedTitle/SharedTitle";
import House1 from "../../../../assets/Images/Houses1.png";
import House2 from "../../../../assets/Images/Houses2.png";
import House3 from "../../../../assets/Images/Houses3.png";
import House4 from "../../../../assets/Images/Houses4.png";

export default function Houses() {
  
const houses = [
  {
    title: "Tabby Town",
    desc: "Gunung Batu, Indonesia",
    img: House1,
  },
  {
    title: "Anggana",
    desc: "Bogor, Indonesia",
    img: House2,
  },
  {
    title: "Seattle Rain",
    desc: "Jakarta, Indonesia",
    img: House3,
  },
  {
    title: "Wodden Pit",
    desc: "Wonosobo, Indonesia",
    img: House4,
  },
];

  return (
    <Box sx={{ py: 5 }}>
      <SharedTitle title="Discover" highlight="Luxury Hotels" />

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

            <Typography sx={{ color: "gray", mb: 2 }}>{house.desc}</Typography>
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
