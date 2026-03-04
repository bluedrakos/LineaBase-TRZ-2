import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export function StatusChart({ data }) {
    const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#059669'];

    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle>Estado de Usuarios</CardTitle>
                <CardDescription>
                    Distribución de usuarios por estado de cuenta.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ left: -20, right: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="hsl(var(--muted-foreground))"
                                opacity={0.1}
                            />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="usu_estado"
                                type="category"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                }}
                            />
                            <Bar
                                dataKey="total"
                                radius={[0, 4, 4, 0]}
                                barSize={32}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
