import { Award, Shield, CheckCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

interface ReputationBadgeProps {
    tier: Tier;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const ReputationBadge = ({ tier, size = 'md', showLabel = true }: ReputationBadgeProps) => {
    const configs = {
        Bronze: {
            icon: Shield,
            color: 'text-amber-700 bg-amber-100 border-amber-200',
            label: 'New Seller',
            desc: 'Just started their journey.'
        },
        Silver: {
            icon: CheckCircle,
            color: 'text-slate-500 bg-slate-100 border-slate-200',
            label: 'Reliable Seller',
            desc: 'Consistent performance and good ratings.'
        },
        Gold: {
            icon: Award,
            color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            label: 'Trusted Seller',
            desc: 'High volume of sales with excellent feedback.'
        },
        Diamond: {
            icon: Zap,
            color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
            label: 'Elite Seller',
            desc: 'Top-tier performance, very low dispute rate.'
        }
    };

    const config = configs[tier] || configs.Bronze;
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'h-6 text-xs px-2',
        md: 'h-8 text-sm px-3',
        lg: 'h-10 text-base px-4'
    };

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className={cn(
                        "flex items-center gap-1.5 rounded-full border font-medium transition-colors cursor-default",
                        config.color,
                        sizeClasses[size]
                    )}>
                        <Icon className={iconSizes[size]} />
                        {showLabel && <span>{config.label}</span>}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-center">
                        <p className="font-semibold">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{config.desc}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
