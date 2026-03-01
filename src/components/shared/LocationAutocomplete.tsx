import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// We need to declare google on window
declare global {
    interface Window {
        google: any;
    }
}

interface LocationAutocompleteProps {
    value: string;
    onSelectCallback: (location: { name: string; lat: number; lng: number }) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export function LocationAutocomplete({
    value,
    onSelectCallback,
    placeholder = "Search for a city, town, or village...",
    className,
    required = false
}: LocationAutocompleteProps) {
    const [inputValue, setInputValue] = useState(value);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            setError("Waiting for Google Maps API Key...");
            return;
        }

        if (window.google && window.google.maps && window.google.maps.places) {
            setIsReady(true);
            return;
        }

        // Load script dynamically
        const scriptId = 'google-maps-places-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                setIsReady(true);
            };

            script.onerror = () => {
                setError("Failed to load Google Maps");
            };

            document.head.appendChild(script);
        } else {
            // Script already added but maybe not loaded
            script.addEventListener('load', () => setIsReady(true));
        }
    }, []);

    useEffect(() => {
        if (!isReady || !inputRef.current) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['(regions)'], // Cities, towns, villages
            componentRestrictions: { country: 'in' }, // Restrict to India based on domain/context
            fields: ['formatted_address', 'geometry', 'name']
        });

        const listener = autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();

            if (!place.geometry || !place.geometry.location) {
                // User pressed enter without selecting a valid place suggestion
                return;
            }

            const locName = place.formatted_address || place.name;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setInputValue(locName);
            onSelectCallback({ name: locName, lat, lng });
        });

        return () => {
            if (window.google) {
                window.google.maps.event.removeListener(listener);
            }
        };
    }, [isReady, onSelectCallback]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

        // If they wipe it out, we might want to clear the coordinates in parent
        if (e.target.value === '') {
            onSelectCallback({ name: '', lat: 0, lng: 0 });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
        }
    };

    return (
        <div className={cn("relative", className)}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={error ? error : placeholder}
                required={required}
                disabled={!!error || !isReady}
                className="pl-10 h-12 rounded-xl bg-secondary border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
                autoComplete="off"
            />
            {!isReady && !error && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>
    );
}
