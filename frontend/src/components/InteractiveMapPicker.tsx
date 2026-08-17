import React, { useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface InteractiveMapPickerProps {
  district: string;
  latitude?: number | null;
  longitude?: number | null;
  onLocationSelect?: (lat: number, lng: number, placeName?: string) => void;
  interactive?: boolean;
}

const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  Mitte: { lat: 52.5200, lng: 13.4050 },
  Nordstadt: { lat: 52.5350, lng: 13.3850 },
  Westend: { lat: 52.5100, lng: 13.3600 },
  Ostend: { lat: 52.4950, lng: 13.4350 },
  Südviertel: { lat: 52.4800, lng: 13.3950 },
};

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  district,
  latitude,
  longitude,
  onLocationSelect,
  interactive = true,
}) => {
  const currentCoords = DISTRICT_COORDS[district] || { lat: 52.5200, lng: 13.4050 };
  const displayLat = latitude ?? currentCoords.lat;
  const displayLng = longitude ?? currentCoords.lng;

  const [pinPos, setPinPos] = useState({ x: 50, y: 50 });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onLocationSelect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPos({ x, y });

    // Approximate lat/lng variance around the selected district
    const latOffset = (50 - y) * 0.0005;
    const lngOffset = (x - 50) * 0.0008;
    const newLat = Number((currentCoords.lat + latOffset).toFixed(6));
    const newLng = Number((currentCoords.lng + lngOffset).toFixed(6));

    onLocationSelect(newLat, newLng);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: '#f8fafc',
        border: '1px solid #cbd5e1',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <LocationOnIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" color="text.primary">
            Location Selector {district ? `(${district})` : ''}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${displayLat.toFixed(4)}, ${displayLng.toFixed(4)}`}
          variant="outlined"
          sx={{ fontFamily: 'monospace', fontWeight: 600 }}
        />
      </Box>

      {/* Styled Interactive SVG Map Canvas */}
      <Box
        onClick={handleMapClick}
        sx={{
          position: 'relative',
          height: 180,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#e2e8f0',
          cursor: interactive ? 'crosshair' : 'default',
          backgroundImage: `
            radial-gradient(#94a3b8 1px, transparent 1px),
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, #f1f5f9 1px)
          `,
          backgroundSize: '20px 20px, 40px 40px, 40px 40px',
          border: '1px solid #cbd5e1',
        }}
      >
        {/* Simulated Road Grid Lines */}
        <svg
          style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.4 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 0 60 Q 150 90 400 40" stroke="#64748b" strokeWidth="4" fill="none" />
          <path d="M 120 0 Q 140 100 130 200" stroke="#64748b" strokeWidth="3" fill="none" />
          <path d="M 280 0 Q 260 120 290 200" stroke="#64748b" strokeWidth="3" fill="none" />
          <path d="M 0 130 Q 200 110 400 150" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="6,4" />
        </svg>

        {/* Pin marker */}
        <Box
          sx={{
            position: 'absolute',
            left: `${pinPos.x}%`,
            top: `${pinPos.y}%`,
            transform: 'translate(-50%, -100%)',
            transition: 'all 0.15s ease-out',
            color: '#e11d48',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        >
          <LocationOnIcon sx={{ fontSize: 32 }} />
        </Box>

        {interactive && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 6,
              left: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: '0.7rem',
              color: '#475569',
              fontWeight: 500,
            }}
          >
            Click map to adjust pin coordinates
          </Box>
        )}
      </Box>
    </Paper>
  );
};
