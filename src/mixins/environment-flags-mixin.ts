import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {EnvFlags, Constructor} from '@unicef-polymer/etools-types';

/**
 * @LitElement
 * @mixinFunction
 */
interface EnvironmentFlagsMixinMethods {
  environmentFlags: EnvFlags | null;
  envFlagsStateChanged(state: any): void;
  envFlagsLoaded(): boolean;
  showPrpReports(): any;
  prpServerIsOn(): any;
  waitForEnvFlagsToLoad(): Promise<boolean>;
}

function EnvironmentFlagsMixin<T extends Constructor<LitElement>>(
  baseClass: T
): T & Constructor<EnvironmentFlagsMixinMethods> {
  class EnvironFlagsClass extends baseClass {
    @property({type: Object})
    environmentFlags: EnvFlags | null = null;

    public envFlagsStateChanged(state: any) {
      if (!state.commonData) {
        return;
      }
      if (JSON.stringify(this.environmentFlags) !== JSON.stringify(state.commonData.envFlags)) {
        this.environmentFlags = state.commonData.envFlags;
      }
    }

    public envFlagsLoaded() {
      return typeof this.environmentFlags !== 'undefined' && this.environmentFlags !== null;
    }

    /** !prp_mode_of */
    public showPrpReports() {
      return this.environmentFlags && !this.environmentFlags.prp_mode_off;
    }

    public prpServerIsOn() {
      return this.environmentFlags && this.environmentFlags.prp_server_on;
    }

    public waitForEnvFlagsToLoad() {
      return new Promise((resolve) => {
        const envFlagsCheck = setInterval(() => {
          if (this.envFlagsLoaded()) {
            clearInterval(envFlagsCheck);
            resolve(true);
          }
        }, 50);
      });
    }
  }
  return EnvironFlagsClass as unknown as T & Constructor<EnvironmentFlagsMixinMethods>;
}

export default EnvironmentFlagsMixin;
