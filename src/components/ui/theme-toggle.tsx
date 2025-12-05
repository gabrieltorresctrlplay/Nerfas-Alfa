import { useTheme } from '@/contexts/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-2 rounded-full h-9 w-9">
          {theme === 'light' ? <Sun className="h-4 w-4" /> : theme === 'dark' ? <Moon className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 rounded-xl">
        <div className="flex flex-col">
          <Button variant={theme === 'light' ? 'secondary' : 'ghost'} onClick={() => setTheme('light')} className="justify-start w-full">
            <Sun className="mr-2 h-4 w-4" />
            <span>Claro</span>
            {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
          </Button>
          <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} onClick={() => setTheme('dark')} className="justify-start w-full">
            <Moon className="mr-2 h-4 w-4" />
            <span>Escuro</span>
            {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
          </Button>
          <Button variant={theme === 'system' ? 'secondary' : 'ghost'} onClick={() => setTheme('system')} className="justify-start w-full">
            <Laptop className="mr-2 h-4 w-4" />
            <span>Sistema</span>
            {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
