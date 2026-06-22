import { useEffect, useState, useContext } from "react";
import {
  Box,
  Card,
  Avatar,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Grid,
  Stack
} from "@mui/material";

import SvgIcon from "@mui/material/SvgIcon";
import type { SvgIconProps } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import axiosClient from "../../../services/api/axiosClient";


const EmailIcon    = (p: SvgIconProps) => <SvgIcon {...p}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></SvgIcon>;
const PhoneIcon    = (p: SvgIconProps) => <SvgIcon {...p}><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z"/></SvgIcon>;
const CountryIcon  = (p: SvgIconProps) => <SvgIcon {...p}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></SvgIcon>;
const CalendarIcon = (p: SvgIconProps) => <SvgIcon {...p}><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></SvgIcon>;
const BadgeIcon    = (p: SvgIconProps) => <SvgIcon {...p}><path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9-3h2v5h-2V4zm9 16H4V9h5v2h6V9h5v11z"/></SvgIcon>;
const RefreshIcon  = (p: SvgIconProps) => <SvgIcon {...p}><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></SvgIcon>;
const VerifiedIcon = (p: SvgIconProps) => <SvgIcon {...p}><path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-13 5-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></SvgIcon>;
const ShieldIcon   = (p: SvgIconProps) => <SvgIcon {...p}><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></SvgIcon>;

// ─── Types ──────
interface UserProfile {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: number;
  country: string;
  role: string;
  profileImage: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ py: 1.5, alignItems: "center" }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: 2, flexShrink: 0,
        bgcolor: "rgba(25,118,210,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#185FA5",
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption"
          sx={{ textTransform: "uppercase", display: "block", letterSpacing: .5, color: "text.secondary", lineHeight: 1.2, fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ num, label }: { num: number | string; label: string }) {
  return (
    <Box sx={{ bgcolor: "#F8F9FB", borderRadius: 2, p: 2, textAlign: "center", flex: 1 }}>
      <Typography variant="h5" color="text.primary" sx={{ fontWeight: 600 }}>
        {num}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { userData } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/admin/users/${userData?._id}`);
        setProfile(res.data.data.user);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (userData?._id) fetchProfile();
  }, [userData?._id]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // Use profileImage from API response — Cloudinary URLs work fine cross-origin
  // Relative paths (old uploads) are blocked by server CORS, so we show initial as fallback
  const imageUrl = profile?.profileImage
    ? (profile.profileImage.startsWith("http")
        ? profile.profileImage
        : undefined)
    : undefined;

  const initial = (profile?.userName ?? "?").charAt(0).toUpperCase();

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
      <CircularProgress />
    </Box>
  );

  if (error || !profile) return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <Typography color="error">{error || "Profile not found."}</Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 780, mx: "auto", p: { xs: 2, md: 3 } }}>

      {/* ── Hero card ── */}
      <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #F1F5F9", mb: 2 }}>
        {/* Banner */}
        <Box sx={{
          height: 120,
          bgcolor: "#185FA5",
          position: "relative",
          backgroundImage:
            "radial-gradient(circle at 15% 50%, rgba(255,255,255,.15) 1px, transparent 1px)," +
            "radial-gradient(circle at 75% 25%, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }} />

        <Box sx={{ px: 3, pt: 0, pb: 3 }}>
          {/* Avatar row */}
          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mt: "-40px", mb: 1.5 }}>
            <Avatar
              src={imageUrl}
              alt={profile.userName}
              sx={{
                width: 80, height: 80,
                border: "3px solid white",
                bgcolor: "#0C447C",
                fontSize: 32, fontWeight: 700, color: "#fff",
              }}
            >
              {initial}
            </Avatar>

            {/* Badges */}
            <Stack direction="row" spacing={1} sx={{ pb: 0.5 }}>
              <Chip
                icon={<ShieldIcon sx={{ fontSize: "14px !important" }} />}
                label={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                size="small"
                sx={{ bgcolor: "#E6F1FB", color: "#0C447C", fontWeight: 600, fontSize: 11, height: 24, border: "none" }}
              />
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: "14px !important" }} />}
                label={profile.verified ? "Verified" : "Not Verified"}
                size="small"
                sx={{
                  bgcolor: profile.verified ? "#EAF3DE" : "#FCEBEB",
                  color: profile.verified ? "#27500A" : "#791F1F",
                  fontWeight: 600, fontSize: 11, height: 24, border: "none",
                }}
              />
            </Stack>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {profile.userName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Member since {formatDate(profile.createdAt)}
          </Typography>
        </Box>
      </Card>

      {/* ── Stat row ── */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <StatCard num={24} label="Bookings" />
        <StatCard num={6}  label="Rooms" />
        <StatCard num={3}  label="Ads" />
      </Stack>

      {/* ── Details card ── */}
      <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #F1F5F9", px: 3, py: 2, mt: 3 }}>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: .8, fontWeight: 600 }}>
          Contact & account info
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ border: "1px solid #F1F5F9", borderRadius: 2, overflow: "hidden", width: "100%" }}>
          <Grid container columns={12} spacing={0} sx={{ width: "100%", m: 0 }}>
            {/* Left */}
            <Grid size={{ xs: 12, sm: 6 }} sx={{ px: 2 }}>
              <InfoRow icon={<EmailIcon fontSize="small" />}   label="Email"   value={profile.email} />
              <Divider sx={{ opacity: .5 }} />
              <InfoRow icon={<PhoneIcon fontSize="small" />}   label="Phone"   value={profile.phoneNumber} />
              <Divider sx={{ opacity: .5 }} />
              <InfoRow icon={<CountryIcon fontSize="small" />} label="Country" value={profile.country} />
            </Grid>

            {/* Right */}
            <Grid size={{ xs: 12, sm: 6 }} sx={{ px: 2, borderLeft: { sm: "1px solid #F1F5F9" }, borderTop: { xs: "1px solid #F1F5F9", sm: "none" } }}>
              <InfoRow
                icon={<BadgeIcon fontSize="small" />}
                label="User ID"
                value={
                  <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                    {profile._id}
                  </Typography>
                }
              />
              <Divider sx={{ opacity: .5 }} />
              <InfoRow icon={<CalendarIcon fontSize="small" />} label="Joined"       value={formatDate(profile.createdAt)} />
              <Divider sx={{ opacity: .5 }} />
              <InfoRow icon={<RefreshIcon fontSize="small" />}  label="Last updated" value={formatDate(profile.updatedAt)} />
            </Grid>
          </Grid>
        </Box>
      </Card>

    </Box>
  );
}