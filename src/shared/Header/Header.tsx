import { Box, Button, Typography } from "@mui/material";

interface HeaderProps {
    title: string;
    subtitle?: string;
    btnText?: string;
    onBtnClick?: () => void;
}

export default function Header({ title, subtitle, btnText, onBtnClick }: HeaderProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                mb: 3,
                boxSizing: "border-box",
            }}
        >
            <Box>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        color: "#1F263E",
                        fontSize: { xs: "20px", sm: "24px" },
                        lineHeight: 1.2,
                        mb: 0.5,
                    }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            color: "#7C8087",
                            fontSize: "14px",
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>

            {btnText && (
                <Button
                    variant="contained"
                    onClick={onBtnClick}
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        fontSize: "14px",
                        textTransform: "none",
                        bgcolor: "#203FC7",
                        color: "white",
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                        boxShadow: "none",
                        "&:hover": {
                            bgcolor: "#1A33A3",
                            boxShadow: "none",
                        },
                    }}
                >
                    {btnText}
                </Button>
            )}
        </Box>
    );
}
