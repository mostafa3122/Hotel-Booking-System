import { Box} from "@mui/material";

type NoDataProps = {

  image?: string;
  height?: number | string;
};

export default function NoData({
  image = "/src/assets/NoData.jpg",
}: NoDataProps) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Image */}
      <Box
        sx={{
          animation: "float 3s ease-in-out infinite",
          "@keyframes float": {
            "0%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-10px)" },
            "100%": { transform: "translateY(0px)" },
          },
        }}
      >
        <img
          src={image}
          alt="no data"
          style={{
            width: "100%",
            maxWidth: 446,
            objectFit: "contain",
            opacity: 0.9,
            borderRadius: 50,
          }}
        />
      </Box>
    </Box>
  );
}
