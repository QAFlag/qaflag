export interface PersonaInitOpts {
  name: string;
  story?: string;
  browser?: {
    userAgent: string;
    viewport: { width: number; height: number };
  };
}

export interface PersonaInterface extends PersonaInitOpts {}
