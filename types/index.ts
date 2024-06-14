export interface ClimateAction {
    id: string;
    title: string;
    startYear: string;
    emissionsReduction: number;
    actionCost: string;
    netZeroPlanId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ClimatePlan {
    id: string;
    targetYear: string;
    currentEmissions: number;
    createdAt: string;
    updatedAt: string;
    climateActions: ClimateAction[];
  }


