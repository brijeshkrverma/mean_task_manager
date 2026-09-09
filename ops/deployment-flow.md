# MEAN Task Manager - deployment flow

1. Code      : write feature in a branch
2. Git       : commit, push, open pull request
3. Build     : npm ci, ng build --configuration production
4. Test      : npm test, health check after start
5. Deploy    : push image / publish static files
6. Monitor   : /api/health, logs, error alerts

Rollback plan: redeploy the previous commit (git revert or previous image tag)