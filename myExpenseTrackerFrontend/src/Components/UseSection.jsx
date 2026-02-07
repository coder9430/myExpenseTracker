import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const UseSection = () => {
  const [active, setActive] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const imageSrc =
    '/images/cartoon-road-vector-illustration_851674-46353 (1).avif';

  const hotspots = [
    {
      id: 1,
      top: '18%',
      left: '22%',
      mobileTop: '18%',
      mobileLeft: '25%',
      title: 'Sign Up / Login',
      desc: 'Log in or sign up to get started.',
    },
    {
      id: 2,
      top: '34%',
      left: '44%',
      mobileTop: '36%',
      mobileLeft: '50%',
      title: 'Create Trip',
      desc: 'Create a trip and share the code.',
    },
    {
      id: 3,
      top: '50%',
      left: '62%',
      mobileTop: '56%',
      mobileLeft: '65%',
      title: 'Join Trip',
      desc: 'Join an existing trip using a code.',
    },
    {
      id: 4,
      top: '66%',
      left: '40%',
      mobileTop: '74%',
      mobileLeft: '38%',
      title: 'Add Expense',
      desc: 'Add expenses and split between members.',
    },
    {
      id: 5,
      top: '80%',
      left: '75%',
      mobileTop: '88%',
      mobileLeft: '75%',
      title: 'Request Payment',
      desc: 'Send payment requests to participants.',
    },
  ];

  const getMobileTransform = (id) => {
    if (id <= 2) {
      return 'translate(-50%, calc(100% + 14px))';
    }
    return 'translate(-50%, calc(-100% - 16px))';
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, mb: 10 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 4, md: 6 },
          alignItems: 'center',
        }}
      >
        {/* TEXT SECTION (comes first on mobile) */}
        <Box
          sx={{
            flex: { md: '0 0 45%' },
            order: { xs: 1, md: 2 }, // ✅ FIX
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.2rem', md: '3.4rem' },
              background:
                'linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Master Your Expenses on the Go!
          </Typography>

          <Typography sx={{ lineHeight: 1.9, fontSize: '1.1rem' }}>
            Track group expenses effortlessly, split costs smartly, and
            settle payments without confusion. Follow the interactive
            journey to see how myExpense simplifies every trip.
          </Typography>
        </Box>

        {/* IMAGE SECTION (comes below text on mobile) */}
        <Box
          sx={{
            flex: { md: '0 0 55%' },
            width: '100%',
            order: { xs: 2, md: 1 }, // ✅ FIX
          }}
        >
          <Box sx={{ position: 'relative', width: '100%' }}>
            <img
              src={imageSrc}
              alt="how to use"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '12px',
              }}
            />

            {hotspots.map((h) => (
              <IconButton
                key={h.id}
                aria-label={h.title}
                onClick={() => {
                  if (isMobile) {
                    setActive(active === h.id ? null : h.id);
                  }
                }}
                onMouseEnter={() => {
                  if (!isMobile) setActive(h.id);
                }}
                onMouseLeave={() => {
                  if (!isMobile) setActive(null);
                }}
                sx={{
                  position: 'absolute',
                  top: { xs: h.mobileTop, md: h.top },
                  left: { xs: h.mobileLeft, md: h.left },
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#44b5ad',
                  color: '#fff',
                  width: { xs: 34, md: 40 },
                  height: { xs: 34, md: 40 },
                  fontWeight: 'bold',
                }}
              >
                {h.id}
              </IconButton>
            ))}

            {hotspots.map(
              (h) =>
                active === h.id && (
                  <Paper
                    key={`tip-${h.id}`}
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      top: { xs: h.mobileTop, md: h.top },
                      left: { xs: h.mobileLeft, md: h.left },
                      transform: {
                        xs: getMobileTransform(h.id),
                        md: 'translate(-50%, calc(-100% - 14px))',
                      },
                      minWidth: 220,
                      p: 1.5,
                      borderLeft: '4px solid #44b5ad',
                      borderRadius: 2,
                      zIndex: 20,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 'bold', mb: 0.5 }}
                    >
                      Step {h.id}: {h.title}
                    </Typography>
                    <Typography variant="body2">{h.desc}</Typography>
                  </Paper>
                )
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UseSection;
