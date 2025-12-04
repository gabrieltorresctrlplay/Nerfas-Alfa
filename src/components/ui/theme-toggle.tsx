import { useTheme } from '@/contexts/ThemeProvider';
import { Button } from '@/components/ui/button'; // Assuming this Button component is robust enough

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={theme === 'light' ? 'secondary' : 'ghost'}
        onClick={() => setTheme('light')}
        className="px-3 py-1 rounded-md text-sm"
      >
        Claro
      </Button>
      <Button
        variant={theme === 'dark' ? 'secondary' : 'ghost'}
        onClick={() => setTheme('dark')}
        className="px-3 py-1 rounded-md text-sm"
      >
        Escuro
      </Button>
      <Button
        variant={theme === 'system' ? 'secondary' : 'ghost'}
        onClick={() => setTheme('system')}
        className="px-3 py-1 rounded-md text-sm"
      >
        Sistema
      </Button>
    </div>
  );
}
