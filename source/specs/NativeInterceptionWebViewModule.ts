/** @format */

import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  setRequestAllowed: (requestId: string, allowed?: boolean) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('InterceptionWebViewModule');
