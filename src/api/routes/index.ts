import { FastifyInstance } from 'fastify';
import { ServiceRegistry } from '../../core/services';
import { registerAuthRoutes } from './auth-routes';
import { registerUserRoutes } from './user-routes';
import { registerLstRoutes } from './lst-routes';
import { registerSwapRoutes } from './swap-routes';
import { registerNetworkRoutes } from './network-routes';
import { registerTransactionRoutes } from './transaction-routes';

/**
 * Register all API routes
 * @param fastify The Fastify instance
 * @param serviceRegistry The service registry
 */
export const registerRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
): void => {
  fastify.register(async (instance) => {
    registerAuthRoutes(instance, serviceRegistry);
    registerUserRoutes(instance, serviceRegistry);
    registerLstRoutes(instance, serviceRegistry);
    registerSwapRoutes(instance, serviceRegistry);
    registerNetworkRoutes(instance, serviceRegistry);
    registerTransactionRoutes(instance, serviceRegistry);
  }, { prefix: '/api/v1' });
}; 