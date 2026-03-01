import * as React from "react"
import { Check, MapPin, ChevronsUpDown, Crosshair, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// We need to declare google on window
declare global {
    interface Window {
        google: any;
    }
}

interface LocationFilterProps {
    value: string
    onChange: (value: string) => void
    onCoordinatesChange?: (coords: { lat: number, lng: number } | null) => void
    className?: string
    placeholder?: string
}

export function LocationFilter({ value, onChange, onCoordinatesChange, className, placeholder = "Select location" }: LocationFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [detecting, setDetecting] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("");
    const [predictions, setPredictions] = React.useState<any[]>([]);
    const [isGoogleReady, setIsGoogleReady] = React.useState(false);

    React.useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) return;
        if (window.google && window.google.maps && window.google.maps.places) {
            setIsGoogleReady(true);
            return;
        }
        const scriptId = 'google-maps-places-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => setIsGoogleReady(true);
            document.head.appendChild(script);
        } else {
            const script = document.getElementById(scriptId) as HTMLScriptElement;
            script.addEventListener('load', () => setIsGoogleReady(true));
        }
    }, []);

    React.useEffect(() => {
        if (!isGoogleReady || !searchQuery) {
            setPredictions([]);
            return;
        }

        const debounce = setTimeout(() => {
            const service = new window.google.maps.places.AutocompleteService();
            service.getPlacePredictions({
                input: searchQuery,
                types: ['(regions)'],
                componentRestrictions: { country: 'in' }
            }, (results: any, status: any) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    setPredictions(results);
                } else {
                    setPredictions([]);
                }
            });
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchQuery, isGoogleReady]);

    const handleSelectLocation = (placeId: string, description: string) => {
        onChange(description);
        setOpen(false);

        if (onCoordinatesChange && isGoogleReady) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ placeId }, (results: any, status: any) => {
                if (status === 'OK' && results && results[0]) {
                    const lat = results[0].geometry.location.lat();
                    const lng = results[0].geometry.location.lng();
                    onCoordinatesChange({ lat, lng });
                }
            });
        }
    };

    const detectCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.")
            return
        }
        setDetecting(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
                    )
                    const data = await res.json()
                    const city =
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.county ||
                        data.address?.state ||
                        "Unknown"
                    onChange(city)
                    if (onCoordinatesChange) {
                        onCoordinatesChange({ lat: latitude, lng: longitude })
                    }
                    setOpen(false)
                } catch {
                    alert("Could not detect your location. Please try again.")
                } finally {
                    setDetecting(false)
                }
            },
            () => {
                alert("Location access denied. Please enable location permissions.")
                setDetecting(false)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    // Default static locations fallback if Google isn't ready or input is empty
    const defaultStaticLocations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Coimbatore", "Chennai", "Kolkata"];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between hover:bg-transparent px-3", className)}
                >
                    <div className="flex items-center gap-2 truncate text-foreground">
                        <MapPin className="h-4 w-4 shrink-0 opacity-50 text-foreground" />
                        <span className="truncate text-foreground">
                            {value === "All Locations" ? "All Locations" : value}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={isGoogleReady ? "Search for a city..." : "Select location (Map API needed for search)..."}
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    {/* Current Location Button */}
                    <div className="px-2 pt-2 pb-1">
                        <button
                            onClick={detectCurrentLocation}
                            disabled={detecting}
                            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-md bg-primary/5 hover:bg-primary/10 text-primary transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            {detecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Crosshair className="h-4 w-4" />
                            )}
                            {detecting ? "Detecting location..." : "📍 Use Current Location"}
                        </button>
                    </div>
                    <CommandList>
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup>
                            {searchQuery && predictions.length > 0 ? (
                                predictions.map((prediction) => (
                                    <CommandItem
                                        key={prediction.place_id}
                                        value={prediction.description}
                                        onSelect={() => handleSelectLocation(prediction.place_id, prediction.structured_formatting?.main_text || prediction.description)}
                                    >
                                        <MapPin className="mr-2 h-4 w-4 opacity-50" />
                                        {prediction.description}
                                    </CommandItem>
                                ))
                            ) : (
                                defaultStaticLocations.map((location) => (
                                    <CommandItem
                                        key={location}
                                        value={location}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? "" : currentValue)
                                            if (onCoordinatesChange) onCoordinatesChange(null)
                                            setOpen(false)
                                            setSearchQuery("")
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === location ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {location}
                                    </CommandItem>
                                ))
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
