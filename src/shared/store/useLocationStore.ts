import { create } from 'zustand';

export interface LocationType {
    _id: string;
    name: string;
    locationType: string;
    branch?: string;
    [key: string]: any;
}

interface LocationState {
    userLocations: LocationType[];
    activeLocation: LocationType | null;
    
    // Actions
    setLocations: (locations: LocationType[]) => void;
    setActiveLocation: (location: LocationType | null) => void;
    
    // Helper to switch module and reset active location if needed
    switchModule: (moduleLocationType: string) => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
    userLocations: [],
    activeLocation: null,

    setLocations: (locations) => set({ userLocations: locations }),
    
    setActiveLocation: (location) => set({ activeLocation: location }),

    switchModule: (moduleLocationType) => {
        const { userLocations, activeLocation } = get();
        
        // Find all locations available for this new module
        const availableLocations = userLocations.filter(
            (loc) => loc.locationType?.toLowerCase() === moduleLocationType.toLowerCase()
        );

        // Check if our current active location is still valid for this module
        const isActiveValid = activeLocation && activeLocation.locationType?.toLowerCase() === moduleLocationType.toLowerCase();

        // If it's not valid, or there is no active location, reset to the first available one
        if (!isActiveValid) {
            set({ activeLocation: availableLocations.length > 0 ? availableLocations[0] : null });
        }
    }
}));
