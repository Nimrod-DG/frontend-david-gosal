import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {Container,Typography,Card, CardContent,Grid,Box, Avatar, Chip, LinearProgress, useTheme, Paper, Divider, List,
        ListItem,ListItemIcon,  ListItemText} from '@mui/material';
import {Public, LocalShipping, Inventory, Calculate, Help, CheckCircle, Warning, Schedule,
  BarChart} from '@mui/icons-material';
import { apiService } from '../../services/api';

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const validCountries = await apiService.getCountries();
        
        const portsPromises = validCountries.map(country => 
          apiService.getPortsByCountry(country.id_negara)
        );
        
        const portsResults = await Promise.all(portsPromises);
        const allValidPorts = portsResults.flat();
        
        const goodsPromises = allValidPorts.map(port => 
          apiService.getGoodsByPort(port.id_pelabuhan)
        );
        
        const goodsResults = await Promise.all(goodsPromises);
        const allValidGoods = goodsResults.flat();

        setStats({
          countries: validCountries.length,
          ports: allValidPorts.length,
          goods: allValidGoods.length,
          lastUpdated: new Date().toLocaleTimeString()
        });
        
      } catch (err) {
        setError(err.message);
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon, color, description }) => (
    <Card sx={{ 
      height: '100%', 
      transition: 'box-shadow 0.2s ease',
      '&:hover': { 
        boxShadow: theme.shadows[4] 
      } 
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box flex={1}>
            {loading ? (
              <Box sx={{ width: '60%', mb: 1 }}>
                <LinearProgress color="inherit" />
              </Box>
            ) : (
              <>
                <Typography variant="h4" component="div" sx={{ color, mb: 0.5 }}>
                  {value}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {title}
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block">
                  {description}
                </Typography>
              </>
            )}
          </Box>
          <Avatar sx={{ 
            bgcolor: `${color}20`, 
            color, 
            width: 48, 
            height: 48 
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const InstructionStep = ({ number, text }) => (
    <Box display="flex" alignItems="flex-start" mb={2}>
      <Avatar sx={{ 
        bgcolor: theme.palette.primary.main, 
        color: theme.palette.primary.contrastText,
        width: 24, 
        height: 24, 
        mr: 2,
        fontSize: '0.8rem'
      }}>
        {number}
      </Avatar>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );

  const ActivityItem = ({ text, time, color }) => (
    <ListItem disableGutters>
      <ListItemIcon sx={{ minWidth: 32 }}>
        <Box width={8} height={8} borderRadius="50%" bgcolor={color} />
      </ListItemIcon>
      <ListItemText 
        primary={text} 
        primaryTypographyProps={{ variant: 'body2' }}
      />
      <Typography variant="caption" color="text.disabled">
        {time}
      </Typography>
    </ListItem>
  );

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Card sx={{ borderColor: 'error.main' }} variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Warning color="error" />
              <Typography variant="h6" color="error">
                Error loading dashboard data
              </Typography>
            </Box>
            <Typography variant="body2">
              {error}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Paper square elevation={0} sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        py: 3,
        mb: 4,
        borderRadius: '0 0 16px 16px',
        boxShadow: theme.shadows[4],
        borderBottom: `4px solid ${theme.palette.primary.light}`
      }}>
        <Container maxWidth="xl">
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            justifyContent="space-between"
            gap={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
                Dashboard Overview
              </Typography>
              <Typography variant="subtitle1" color="rgba(255,255,255,0.85)" sx={{ mb: { xs: 1, sm: 0 } }}>
                Welcome back, {user?.name || 'User'}!
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={2} sx={{ 
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' }
            }}>
              <Chip 
                label="System Online" 
                size="small"
                icon={<CheckCircle fontSize="small" />}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  '& .MuiChip-icon': { 
                    color: theme.palette.success.light,
                    marginLeft: '8px'
                  },
                  fontWeight: 500
                }}
              />
              
              {!loading && stats?.lastUpdated && (
                <Box display="flex" alignItems="center" gap={1} sx={{
                  bgcolor: 'rgba(0,0,0,0.1)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '16px'
                }}>
                  <Schedule fontSize="small" sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500
                  }}>
                    Updated: {stats.lastUpdated}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Countries"
              value={stats?.countries || '...'}
              icon={<Public />}
              color={theme.palette.primary.main}
              description="Valid countries with ports"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Ports"
              value={stats?.ports || '...'}
              icon={<LocalShipping />}
              color={theme.palette.success.main}
              description="Active ports in valid countries"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Products"
              value={stats?.goods || '...'}
              icon={<Inventory />}
              color={theme.palette.warning.main}
              description="Goods in active ports"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Calculations"
              value="Auto"
              icon={<Calculate />}
              color={theme.palette.info.main}
              description="Real-time pricing"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <BarChart color="primary" />
                  <Typography variant="h6">
                    System Activity
                  </Typography>
                </Box>
                
                <List disablePadding>
                  <ActivityItem 
                    text="Data Sync"
                    time="2 min ago"
                    color={theme.palette.success.main}
                  />
                  <ActivityItem 
                    text="Cache Updated"
                    time="5 min ago"
                    color={theme.palette.info.main}
                  />
                  <ActivityItem 
                    text="Price Refresh"
                    time="12 min ago"
                    color={theme.palette.warning.main}
                  />
                </List>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Uptime
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="medium">
                    99.9%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Help color="primary" />
                  <Typography variant="h6">
                    How to Use This Application
                  </Typography>
                </Box>
                
                <InstructionStep 
                  number="1" 
                  text="Navigate to the Form page to start using the autocomplete features." 
                />
                <InstructionStep 
                  number="2" 
                  text="Select a Country from the dropdown - this will load available ports." 
                />
                <InstructionStep 
                  number="3" 
                  text="Choose a Port - this will load available goods for that port." 
                />
                <InstructionStep 
                  number="4" 
                  text="Select a Product - this will automatically populate the price and discount." 
                />
                <InstructionStep 
                  number="5" 
                  text="The total will be calculated automatically based on the price and discount." 
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;