import {EnvFlags, Constructor} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit';
/**
 * @polymer
 * @mixinFunction
 */
declare function EnvironmentFlagsMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    environmentFlags: EnvFlags | null;
    envFlagsStateChanged(state: any): void;
    envFlagsLoaded(): boolean;
    /** !prp_mode_of */
    showPrpReports(): boolean | null;
    prpServerIsOn(): boolean | null;
    waitForEnvFlagsToLoad(): Promise<unknown>;
  };
} & T;
export default EnvironmentFlagsMixin;
