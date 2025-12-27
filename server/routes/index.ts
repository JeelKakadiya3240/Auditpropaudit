import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './users';
import { propertyRoutes } from './properties';
import { auditRoutes } from './audits';
import { newsRoutes } from './news';
import { contactRoutes } from './contact';

// API versioning
const API_VERSION = '/v1';

// Create main router
const router = Router();

// Mount route modules
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/properties`, propertyRoutes);
router.use(`${API_VERSION}/audits`, auditRoutes);
router.use(`${API_VERSION}/news`, newsRoutes);
router.use(`${API_VERSION}/contact`, contactRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'AuditProp API',
    version: '1.0.0',
    description: 'Property audit and verification platform',
    endpoints: {
      auth: `${API_VERSION}/auth`,
      users: `${API_VERSION}/users`,
      properties: `${API_VERSION}/properties`,
      audits: `${API_VERSION}/audits`,
      news: `${API_VERSION}/news`,
      contact: `${API_VERSION}/contact`,
    },
  });
});

export default router;