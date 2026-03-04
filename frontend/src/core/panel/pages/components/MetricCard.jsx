import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Info } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

export function MetricCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    sparklineData,
    tooltipText,
    className,
}) {
    return (
        <Card
            className={cn(
                'flex flex-col justify-between overflow-hidden',
                className,
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="text-muted-foreground h-4 w-4" />}
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            {tooltipText ||
                                `Información detallada sobre ${title}`}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-end justify-between">
                    <div className="space-y-1">
                        <div className="text-3xl font-bold">{value}</div>
                        {description && (
                            <p className="text-muted-foreground text-xs">
                                {description}
                            </p>
                        )}
                    </div>
                    {sparklineData && (
                        <div className="h-[40px] w-[80px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sparklineData}>
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={
                                            trend?.value.startsWith('+')
                                                ? '#10b981'
                                                : '#ef4444'
                                        }
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 text-sm">
                    <span className="text-muted-foreground font-medium">
                        Detalles
                    </span>
                    {trend && (
                        <span
                            className={cn(
                                'flex items-center gap-1 font-bold',
                                trend.value.startsWith('+')
                                    ? 'text-green-600'
                                    : 'text-red-600',
                            )}
                        >
                            {trend.value}
                            {trend.value.startsWith('+') ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-arrow-up"
                                >
                                    <path d="m5 12 7-7 7 7" />
                                    <path d="M12 19V5" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-arrow-down"
                                >
                                    <path d="M12 5v14" />
                                    <path d="m19 12-7 7-7-7" />
                                </svg>
                            )}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
