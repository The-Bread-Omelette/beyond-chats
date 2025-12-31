import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    Stack,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    ArrowBack,
    SwapHoriz,
} from '@mui/icons-material';
import { useArticle } from '../hooks/useArticles';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import PageTransition from '../components/ui/PageTransition';
import VersionCompare from '../components/compare/VersionCompare';

const ComparisonPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { article, loading, error } = useArticle(id);

    if (loading) return <LoadingSpinner message="Loading comparison..." />;
    if (error) return <ErrorMessage message={error} />;
    if (!article || article.enhancementStatus !== 'completed') {
        return <ErrorMessage message="Enhanced version not available" />;
    }

    return (
        <PageTransition>
            <Box sx={{ maxWidth: '100%', pb: 6 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                            mb: 4,
                            pb: 3,
                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={() => navigate(`/article/${id}`)}
                                variant="text"
                                color="inherit"
                                sx={{
                                    minWidth: 'auto',
                                    p: 1.5,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                                }}
                            >
                            </Button>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                    Content Comparison
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Review AI enhancements against original
                                </Typography>
                            </Box>
                        </Box>

                        {/* 
                         <Tooltip title="Toggle view">
                           <IconButton>
                             <SwapHoriz />
                           </IconButton>
                         </Tooltip> 
                         */}
                    </Box>
                </motion.div>

                <VersionCompare
                    original={article.originalContent || article.excerpt || ''}
                    enhanced={article.content || ''}
                />

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 4,
                            p: 3,
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Enhancement Statistics
                        </Typography>
                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Original Length
                                </Typography>
                                <Typography variant="h5" fontWeight={600}>
                                    {article.excerpt?.length || 0} <Typography component="span" variant="caption" color="text.secondary">chars</Typography>
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Enhanced Length
                                </Typography>
                                <Typography variant="h5" fontWeight={600} color="primary.main">
                                    {article.content?.length || 0} <Typography component="span" variant="caption" color="text.secondary">chars</Typography>
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Sources Used
                                </Typography>
                                <Typography variant="h5" fontWeight={600} color="success.main">
                                    {article.references?.length || 0} <Typography component="span" variant="caption" color="text.secondary">articles</Typography>
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </motion.div>
            </Box>
        </PageTransition>
    );
};

export default ComparisonPage;
