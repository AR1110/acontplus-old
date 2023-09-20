export interface Inspection {
    id: number;
    supportId: number;
    date: string;
    mileage: string;
    fuelLevel: string;
    engine: string;
    transmission: string;
    brake: string;
    steering: string;
    suspension: string;
    obs: string;
    enabled: boolean;
}