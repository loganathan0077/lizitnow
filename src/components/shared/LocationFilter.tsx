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
import { locations } from "@/data/mockData"

interface LocationFilterProps {
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
}

export function LocationFilter({ value, onChange, className, placeholder = "Select location" }: LocationFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [detecting, setDetecting] = React.useState(false)

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

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between hover:bg-transparent", className)}
                >
                    <div className="flex items-center gap-2 truncate">
                        <MapPin className="h-4 w-4 shrink-0 opacity-50" />
                        <span className="truncate">
                            {value === "All Locations" ? "All Locations" : value}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search location..." />
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
                            {locations.map((location) => (
                                <CommandItem
                                    key={location}
                                    value={location}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
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
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

