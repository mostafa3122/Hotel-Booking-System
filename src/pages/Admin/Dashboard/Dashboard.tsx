import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlined';
import { PieChart } from '@mui/x-charts/PieChart';
import { getDashboardData, type DashboardData } from '../../../services/api/dashboard';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData| null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      setData(response.data || null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Rooms', value: data?.rooms ?? (loading ? '...' : '0') },
    { title: 'Facilities', value: data?.facilities ?? (loading ? '...' : '0') },
    { title: 'Ads', value: data?.ads ?? (loading ? '...' : '0') },
  ];

  const bookingData = [
    { name: 'pending', value: data?.bookings?.pending ?? 0, color: '#5368F0' },
    { name: 'completed', value: data?.bookings?.completed ?? 0, color: '#9D57D5' },
  ];

  const userData = [
    { name: 'User', value: data?.users?.user ?? 0, color: '#54D14D' },
    { name: 'Admin', value: data?.users?.admin ?? 0, color: '#35C2FD' },
  ];

  return (
    <>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.title}>
            <Paper
              sx={{
                p: { xs: 3, sm: 2, md: 3 },
                bgcolor: '#1E2538', 
                color: 'white',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: { xs: '2rem', sm: '1.5rem', md: '2.25rem' } }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontFamily: 'Poppins', mt: 0.5 }}>
                  {stat.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: '#203FC733',
                  border: '1px solid #203FC733',
                  p: { xs: 1.5, sm: 1, md: 1.5 },
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WorkOutlineIcon sx={{ color: '#203FC7', fontSize: { xs: '26px', sm: '20px', md: '26px' } }} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

        
      <Grid container spacing={3}>
       
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: '16px',
              minHeight: '280px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 3, sm: 5 },
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChart
                  series={[
                    {
                      data: bookingData.map((item, index) => ({
                        id: index,
                        value: item.value,
                        color: item.color,
                      })),
                      innerRadius: 50,
                      outerRadius: 100,
                      paddingAngle: 1,
                      cx: '50%',
                      cy: '50%',
                    },
                  ]}
                  margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  width={200}
                  height={200}
                  hideLegend
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '120px' }}>
                {bookingData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: item.color }} />
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#64748B', textTransform: 'capitalize', fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

     
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: '16px',
              minHeight: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 3, sm: 5 },
                width: '100%',
              }}
            >
           
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minWidth: '160px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#54D14D' }} />
                    <Typography sx={{ fontFamily: 'Poppins', color: '#1E293B', fontWeight: 500 }}>User</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'Poppins', color: '#64748B', fontWeight: 600 }}>
                    {data?.users?.user ?? (loading ? '...' : '25')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#35C2FD' }} />
                    <Typography sx={{ fontFamily: 'Poppins', color: '#1E293B', fontWeight: 500 }}>Admin</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'Poppins', color: '#64748B', fontWeight: 600 }}>
                    {data?.users?.admin ?? (loading ? '...' : '10')}
                  </Typography>
                </Box>
              </Box>

            
              <Box sx={{ position: 'relative', width: 160, height: 160, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChart
                  series={[
                    {
                      data: userData.map((item, index) => ({
                        id: index,
                        value: item.value,
                        color: item.color,
                      })),
                      innerRadius: 55,
                      outerRadius: 65,
                      paddingAngle: 1,
                      cx: '50%',
                      cy: '50%',
                    },
                  ]}
                  margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  width={160}
                  height={160}
                  hideLegend
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Poppins', color: '#1E293B' }}>
                    Users
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
