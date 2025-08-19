import { ConfigurationService } from '@modules/config/services/configuration.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const setupGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const configService = inject(ConfigurationService);
  const shouldShowSetup = configService.shouldShowSetup;

  if (!shouldShowSetup) {
    return false;
  }

  // Check if user is trying to access a specific step
  const stepRoute = route.url[0]?.path;
  if (stepRoute && stepRoute === 'setup') {
    const setupStatus = configService.getSetupStatus();

    // Allow access to next incomplete step or any completed step
    if (setupStatus.nextIncompleteStep) {
      const nextStep = configService.getStepByRoute(`/config/${route}`);
      if (nextStep && (nextStep.isCompleted || nextStep.id === setupStatus.nextIncompleteStep)) {
        return true;
      }
    }
    // Redirect to setup dashboard if trying to access wrong step
    router.navigate(['./setup']);
    return false;
  }

  return true;
};
