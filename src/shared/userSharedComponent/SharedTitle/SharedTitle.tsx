import { Box, Typography } from "@mui/material";

interface SharedTitleProps {
  title: string;
  highlight: string;
}

const SharedTitle: React.FC<SharedTitleProps> = ({ title, highlight }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          position: "relative",
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
            background: "linear-gradient(90deg, #2844C7, #4D68E8)",
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
        {title}{" "}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg, #2844C7, #4D68E8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {highlight}
        </Box>
      </Typography>
    </Box>
  );
};

export default SharedTitle;