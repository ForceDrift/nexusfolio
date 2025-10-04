import { 
  BarChart3, 
  Shield, 
  Zap, 
  Scale, 
  TrendingUp, 
  Building2, 
  Newspaper, 
  HelpCircle 
} from "lucide-react";

export interface SlashCommand {
  command: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  category: 'analysis' | 'portfolio' | 'market' | 'help';
  displayText?: string; // What the user sees in the chat
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    command: '/analyze',
    description: 'Analyze portfolio performance',
    icon: BarChart3,
    prompt: 'Please analyze my portfolio performance and provide insights on recent changes.',
    displayText: '/analyze',
    category: 'analysis'
  },
  {
    command: '/risk',
    description: 'Risk assessment',
    icon: Shield,
    prompt: 'Provide a comprehensive risk assessment of my current portfolio allocation.',
    displayText: '/risk',
    category: 'analysis'
  },
  {
    command: '/optimize',
    description: 'Portfolio optimization',
    icon: Zap,
    prompt: 'Suggest portfolio optimization strategies to improve returns and reduce risk.',
    displayText: '/optimize',
    category: 'portfolio'
  },
  {
    command: '/rebalance',
    description: 'Rebalancing suggestions',
    icon: Scale,
    prompt: 'Recommend portfolio rebalancing based on current market conditions.',
    displayText: '/rebalance',
    category: 'portfolio'
  },
  {
    command: '/trends',
    description: 'Market trends',
    icon: TrendingUp,
    prompt: 'What are the current market trends I should be aware of?',
    displayText: '/trends',
    category: 'market'
  },
  {
    command: '/sectors',
    description: 'Sector analysis',
    icon: Building2,
    prompt: 'Provide analysis of different sectors and their outlook.',
    displayText: '/sectors',
    category: 'market'
  },
  {
    command: '/news',
    description: 'Market news',
    icon: Newspaper,
    prompt: 'Share the latest relevant market news and its potential impact.',
    displayText: '/news',
    category: 'market'
  },
  {
    command: '/help',
    description: 'Show all commands',
    icon: HelpCircle,
    prompt: 'Show me all available commands and how to use them.',
    displayText: '/help',
    category: 'help'
  }
];

export const getCommandsByCategory = (category: string) => {
  return SLASH_COMMANDS.filter(cmd => cmd.category === category);
};

export const searchCommands = (query: string) => {
  if (!query) return SLASH_COMMANDS;
  
  const lowercaseQuery = query.toLowerCase();
  return SLASH_COMMANDS.filter(cmd => 
    cmd.command.toLowerCase().includes(lowercaseQuery) ||
    cmd.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const getCommandByText = (text: string) => {
  const command = text.split(' ')[0];
  return SLASH_COMMANDS.find(cmd => cmd.command === command);
};
