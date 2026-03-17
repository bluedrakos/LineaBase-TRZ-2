import { useTheme } from '@/shared/hooks/useTheme';
import { Toaster as SileoToaster } from 'sileo';

const Toaster = ({ richColors: _richColors, ...props }) => {
    const { theme = 'system' } = useTheme();

    return <SileoToaster theme={theme} {...props} />;
};

export { Toaster };
