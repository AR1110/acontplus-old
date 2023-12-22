export interface Inspection {
    id: number;
    supportId: number;
    date: string;
    mileage: number;
    fuelLevel: string;
    engine: string;
    cabin : string;
    bearing : string;
    transmission: string;
    lighting : string;
    brake: string;
    steering: string;
    suspension: string;
    obs: string;
    enabled: boolean;
}