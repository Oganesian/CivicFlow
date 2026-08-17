import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Card,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { publicApi } from '../../api/client';
import { DistrictSelect } from '../../components/DistrictSelect';
import { DISTRICTS } from '../../components/districts';
import { InteractiveMapPicker } from '../../components/InteractiveMapPicker';
import { PublicIssue } from '../../api/types';

const issueSchema = z.object({
  categoryId: z.string().min(1, 'Please select an issue category'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(15, 'Please provide a detailed description (at least 15 characters)'),
  district: z.string().min(1, 'Please select a municipal district'),
  locationName: z.string().min(3, 'Location description is required'),
  reporterEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
});

type IssueFormValues = z.infer<typeof issueSchema>;

export const ReportIssuePage: React.FC = () => {
  const [createdIssue, setCreatedIssue] = useState<PublicIssue | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 52.5200,
    lng: 13.4050,
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['public-categories'],
    queryFn: publicApi.getCategories,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      categoryId: '',
      title: '',
      description: '',
      district: DISTRICTS[0],
      locationName: '',
      reporterEmail: '',
    },
  });

  const selectedDistrict = watch('district') || DISTRICTS[0];
  const selectedCategoryId = watch('categoryId');
  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);

  const mutation = useMutation({
    mutationFn: (values: IssueFormValues) =>
      publicApi.createIssue({
        ...values,
        reporterEmail: values.reporterEmail || undefined,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      }),
    onSuccess: (data) => {
      setCreatedIssue(data);
    },
  });

  const onSubmit = (values: IssueFormValues) => {
    mutation.mutate(values);
  };

  if (createdIssue) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#16a34a', mb: 2 }} />
          <Typography variant="h4" fontWeight={800} color="#166534" gutterBottom>
            Report Successfully Submitted!
          </Typography>
          <Typography variant="body1" color="#15803d" mb={3}>
            Your service request has been registered in the municipal operations queue.
          </Typography>

          <Card variant="outlined" sx={{ p: 2.5, mb: 4, backgroundColor: '#ffffff', borderColor: '#86efac' }}>
            <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={700}>
              Tracking Reference Code
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#1e3a8a', my: 1 }}>
              {createdIssue.referenceCode}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Save this tracking code to check status updates or share with community members.
            </Typography>
          </Card>

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              component={RouterLink}
              to={`/issues/${createdIssue.referenceCode}`}
              variant="contained"
              color="primary"
            >
              View Public Timeline
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setCreatedIssue(null);
                setValue('title', '');
                setValue('description', '');
                setValue('locationName', '');
              }}
            >
              Submit Another Report
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box mb={4}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          size="small"
          sx={{ mb: 1, color: 'text.secondary' }}
        >
          Back to Home
        </Button>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Report a Municipal Service Issue
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please provide details regarding the location and nature of the issue. Operational teams will triage and assign technicians.
        </Typography>
      </Box>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to submit report. Please check your inputs and try again.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Category Select */}
            <Grid item xs={12} sm={8}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.categoryId}>
                    <InputLabel id="category-label">Issue Category *</InputLabel>
                    <Select
                      {...field}
                      labelId="category-label"
                      label="Issue Category *"
                      disabled={loadingCategories}
                    >
                      {categories?.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {errors.categoryId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.categoryId.message}
                </Typography>
              )}
            </Grid>

            {/* SLA Target Info */}
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: '#f8fafc', height: '100%', display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Target SLA:{' '}
                  <strong>{selectedCategory ? `${selectedCategory.defaultSlaHours} hours` : 'Select category'}</strong>
                </Typography>
              </Paper>
            </Grid>

            {/* Title */}
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Issue Title *"
                    placeholder="e.g. Deep pothole causing cyclist hazard"
                    fullWidth
                    size="small"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Detailed Description *"
                    placeholder="Describe what happened, exact landmark, and any immediate danger..."
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            {/* District & Location */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <DistrictSelect
                    value={field.value}
                    onChange={field.onChange}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="locationName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street / Exact Location *"
                    placeholder="e.g. Schillerstraße 42 near the bakery"
                    fullWidth
                    size="small"
                    error={!!errors.locationName}
                    helperText={errors.locationName?.message}
                  />
                )}
              />
            </Grid>

            {/* Interactive Map Picker */}
            <Grid item xs={12}>
              <InteractiveMapPicker
                district={selectedDistrict}
                latitude={coordinates.lat}
                longitude={coordinates.lng}
                onLocationSelect={(lat, lng) => setCoordinates({ lat, lng })}
              />
            </Grid>

            {/* Optional Email & Privacy Note */}
            <Grid item xs={12}>
              <Controller
                name="reporterEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Your Email (Optional)"
                    placeholder="citizen@example.test"
                    fullWidth
                    size="small"
                    error={!!errors.reporterEmail}
                    helperText={errors.reporterEmail?.message}
                  />
                )}
              />
              <Box display="flex" alignItems="center" gap={1} mt={1} color="text.secondary">
                <LockOutlinedIcon fontSize="small" sx={{ fontSize: 16 }} />
                <Typography variant="caption">
                  <strong>Privacy Guaranteed:</strong> Your email is strictly confidential for notifications only and is <em>never</em> shown on public pages.
                </Typography>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={mutation.isPending}
                startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{ py: 1.3, fontWeight: 700 }}
              >
                {mutation.isPending ? 'Submitting Report...' : 'Submit Incident Report'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
